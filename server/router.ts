import { Router } from "express";
import path from "path";
import { NetworkModel } from "./model";
import {
  Indexed,
  PersonalData,
  Post,
  Role,
  Status,
  StatusData,
  UserStatusData,
} from "../api";
import { Multer } from "multer";
import { SocketManager } from "./websocket";

export function createNetworkRouter(
  model: NetworkModel,
  sm: SocketManager,
  storagePath: string,
  uploader: Multer
): Router {
  const router = Router();
  const blockedImg = "blocked.jpg";

  // Проверка объекта пользователя в res.locals.user
  router.use((req, res, next) => {
    if (res.locals.user) {
      // console.log(res.locals.user);
      next();
    } else res.status(500).end("User authentication error");
  });

  // Получение собственного id
  router.get("/self", (req, res) => {
    res.json({ id: res.locals.user.id } as Indexed);
  });

  // Список пользователей
  router.get("/users", (req, res) => {
    res.json(model.getUsers());
  });

  // Middleware для извлечения id пользователя в маршрутах /user/id/*
  router.use("/user/:id", (req, res, next) => {
    res.locals.id = parseInt(req.params.id);
    next();
  });

  // Маршруты ресурсов пользователя
  router.use(
    "/user/:id",
    Router()
      .get("/photos", (req, res) => {
        res.json(model.getPhotos(res.locals.id));
      })
      .get("/posts", (req, res) => {
        res.json(model.getPosts(res.locals.id));
      })
      .get("/friends", (req, res) => {
        res.json(model.getFriends(res.locals.id));
      })
      .get("/friendsposts", (req, res) => {
        res.json(model.getFriendsPosts(res.locals.id));
      })
  );

  // Загрузить аватарку
  router.put("/avatar", uploader.single("avatar"), (req, res) => {
    if (req.file) {
      model.updateAvatar(res.locals.user.id, req.file.filename);
      res.sendStatus(200);
    } else res.sendStatus(204);
  });
  router.delete("/avatar", (req, res) => {
    model.deleteAvatar(res.locals.user.id);
    res.sendStatus(200);
  });

  router
    .route("/friend/:id")
    .all((req, res, next) => {
      res.locals.id = parseInt(req.params.id);
      if (res.locals.id) next();
    })
    // Отправить/принять заявку
    .post((req, res) => {
      model.friendRequest(res.locals.user.id, res.locals.id);
      res.end();
    })
    // Отменить/отклонить заявку / удалить друга
    .delete((req, res) => {
      model.friendDecline(res.locals.user.id, res.locals.id);
      res.end();
    });

  // Опубликовать запись
  router.post("/post", uploader.array("photos"), (req, res) => {
    const post = req.body as Post;
    sm.post(res.locals.user);
    res.json({
      id: model.addPost(
        res.locals.user.id,
        post.text,
        ((req.files ?? []) as Express.Multer.File[]).map((f) =>
          model.addPhoto(res.locals.user.id, f.filename)
        )
      ),
    } as Indexed);
  });

  // Обращения к посту
  router
    .route("/post/:postid")
    .all((req, res, next) => {
      res.locals.id = parseInt(req.params.postid);
      next();
    })
    .get((req, res) => {
      const post = model.getPost(res.locals.id);
      if (post) {
        if (
          post.status !== Status.BLOCKED ||
          res.locals.user.role === Role.ADMIN
        )
          res.json(post);
        else
          res.json({
            ...post,
            text: "<Ресурс заблокирован администрацией>",
          } as Post);
      } else res.status(204).json(null);
    })
    // Обновление статуса поста
    .patch((req, res) => {
      if (res.locals.user.role === Role.ADMIN) {
        model.updatePostStatus(res.locals.id, req.body as StatusData);
        res.sendStatus(200);
      } else res.sendStatus(401);
    });

  // Обращения к изображению
  router
    .route("/photo/:photoid")
    .all((req, res, next) => {
      res.locals.id = parseInt(req.params.photoid);
      next();
    })
    .get((req, res) => {
      const photo = model.getPhoto(res.locals.id);
      if (photo) {
        if (
          photo.status !== Status.BLOCKED ||
          res.locals.user.role === Role.ADMIN
        )
          res.download(path.resolve(storagePath, photo.file));
        else res.download(path.resolve(storagePath, blockedImg));
      } else res.sendStatus(204);
    });

  // Обращение к информации фото
  router
    .route("/photoinfo/:photoid")
    .all((req, res, next) => {
      res.locals.id = parseInt(req.params.photoid);
      next();
    })
    .get((req, res) => {
      const photoid = parseInt(req.params.photoid);
      res.json(model.getPhoto(photoid));
    })
    // Обновление статуса изображения
    .patch((req, res) => {
      if (res.locals.user.role === Role.ADMIN) {
        model.updatePhotoStatus(res.locals.id, req.body as StatusData);
        res.sendStatus(200);
      } else res.sendStatus(401);
    });

  // Маршруты данных пользователя
  router
    .route("/user/:id")
    .get((req, res) => {
      res.json(model.getUserData(res.locals.id));
    })
    .put((req, res) => {
      if (
        res.locals.user.role === Role.ADMIN ||
        res.locals.user.id == res.locals.id
      ) {
        const data = req.body as PersonalData;
        model.updatePersonal(res.locals.id, data);
        res.sendStatus(200);
      } else res.sendStatus(401);
    })
    .patch((req, res) => {
      if (res.locals.user.role === Role.ADMIN) {
        const data = req.body as UserStatusData;
        model.updateUserStatus(res.locals.id, data);
        res.sendStatus(200);
      } else res.sendStatus(401);
    });

  return router;
}
