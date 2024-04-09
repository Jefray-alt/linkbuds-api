import LinkListService from '../service/linkListService';
import UserService from '../service/userService';
import { type LinkListPayload } from '../types/payload';
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

export default router;
