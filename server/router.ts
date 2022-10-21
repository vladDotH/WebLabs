import { Router } from "express";
import path from "path";
import { Controller } from "./Controller";
import { PersonalData, StatusData, UserStatusData } from "../api";

export function createAdminRouter(
  controller: Controller,
  storagePath: string
): Router {
  const router = Router();

  // Список пользователей
  router.get("/users", (req, res) => {
    res.json(controller.getUsers());
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
        res.json(controller.getPhotos(res.locals.id));
      })
      .get("/posts", (req, res) => {
        res.json(controller.getPosts(res.locals.id));
      })
      .get("/friends", (req, res) => {
        res.json(controller.getFriends(res.locals.id));
      })
      .get("/friendsposts", (req, res) => {
        res.json(controller.getFriendsPosts(res.locals.id));
      })
  );

  // Обращения к посту
  router
    .route("/post/:postid")
    .all((req, res, next) => {
      res.locals.id = parseInt(req.params.postid);
      next();
    })
    .get((req, res) => {
      res.json(controller.getPost(res.locals.id));
    })
    .patch((req, res) => {
      controller.updatePostStatus(res.locals.id, req.body as StatusData);
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
      const photo = controller.getPhoto(res.locals.id);
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
      res.json(controller.getPhoto(photoid));
    })
    .patch((req, res) => {
      controller.updatePhotoStatus(res.locals.id, req.body as StatusData);
      res.sendStatus(200);
    });

  // Маршруты данных пользователя
  router
    .route("/user/:id")
    .get((req, res) => {
      res.json(controller.getUserData(res.locals.id));
    })
    .put((req, res) => {
      const data = req.body as PersonalData;
      controller.updatePersonal(res.locals.id, data);
      res.sendStatus(200);
    })
    .patch((req, res) => {
      const data = req.body as UserStatusData;
      controller.updateUserStatus(res.locals.id, data);
      res.sendStatus(200);
    });

  return router;
}
