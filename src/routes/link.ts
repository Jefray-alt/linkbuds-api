import LinkListService from '../service/linkListService';
import UserService from '../service/userService';
import { type LinkListPayload } from '../types/payload';
import { BadRequestErrror } from '../utils/errors';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();
const linkListService = new LinkListService();
const userService = new UserService();

router.post(
  '/',
  expressAsyncHandler(async (req, res, next) => {
    try {
      const linkList = linkListService.create(req.body as LinkListPayload);
      const user = await userService.findById(req.user.userId);
      if (user === null) {
        throw new Error('User not found');
      }

      linkList.user = user;
      await linkListService.save(linkList);

      res.send(linkList);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  '/',
  expressAsyncHandler(async (req, res, next) => {
    try {
      const linkList = await linkListService.findByUser(req.user.userId);
      res.send(linkList);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  '/:slug',
  expressAsyncHandler(async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { userId } = req.user;
      const linkList = await linkListService.findOneBySlug(userId, slug);
      if (linkList === null) {
        throw new BadRequestErrror('Link list does not exist');
      }
      res.send(linkList);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
