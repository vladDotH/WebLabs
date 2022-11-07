import { NextFunction, Response, Router } from "express";
import path from "path";
import { NetworkModel } from "./model";
import {
  PersonalData,
  Role,
  StatusData,
  UserStatusData,
  Post,
  Indexed,
} from "../api";
import { Multer } from "multer";

export function createNetworkRouter(
  model: NetworkModel,
  storagePath: string,
  uploader: Multer
): Router {
  const router = Router();

  // Проверка объекта пользователя в res.locals.user
  router.use((req, res, next) => {
    if (res.locals.user) {
      // console.log(res.locals.user);
      next();
    } else res.status(500).end("User auth error");
  });

  router.get("/self", (req, res) => {
    res.json({ id: res.locals.user.id } as Indexed);
  });

  // Список пользователей
  router.get("/users", (req, res) => {
    res.json(model.getUsers());
  });

  // Middleware для извлечения id пользователя
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

  // TODO
  // Загрузить аватарку
  router.put("/avatar", uploader.single("avatar"), (req, res) => {});
  // Отправить заявку
  router.post("/friend/:id/request", (req, res) => {});
  // Отменить заявку / удалить друга
  router.delete("/friend/:id/request", (req, res) => {});
  // Подтвердить заявку
  router.post("/friend/:id/accept", (req, res) => {});
  // Отклонить заявку
  router.post("/friend/:id/decline", (req, res) => {});

  // Опубликовать запись
  router.post("/post", uploader.array("photos"), (req, res) => {
    const post = req.body as Post;
    console.log(req.files);
    res.json(model.addPost({ ...post, userId: res.locals.user.id }));
  });

  // Отправить сообщение
  router.post("/message", (req, res) => {});

  // Обращения к посту
  router
    .route("/post/:postid")
    .all((req, res, next) => {
      res.locals.id = parseInt(req.params.postid);
      next();
    })
    .get((req, res) => {
      res.json(model.getPost(res.locals.id));
    })
    // TODO protection
    .patch((req, res) => {
      model.updatePostStatus(res.locals.id, req.body as StatusData);
      res.sendStatus(200);
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
      if (photo) res.download(path.resolve(storagePath, photo.file));
      else res.sendStatus(204);
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
    // TODO protection
    .patch((req, res) => {
      model.updatePhotoStatus(res.locals.id, req.body as StatusData);
      res.sendStatus(200);
    });

  // Маршруты данных пользователя
  router
    .route("/user/:id")
    .get((req, res) => {
      res.json(model.getUserData(res.locals.id));
    })
    // TODO protection
    .put((req, res) => {
      const data = req.body as PersonalData;
      model.updatePersonal(res.locals.id, data);
      res.sendStatus(200);
    })
    // TODO protection
    .patch((req, res) => {
      const data = req.body as UserStatusData;
      model.updateUserStatus(res.locals.id, data);
      res.sendStatus(200);
    });

  return router;
}
