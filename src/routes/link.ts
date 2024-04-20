import { type LinkList } from '../entity/LinkList.entity';
import LinkListService from '../service/linkListService';
import UserService from '../service/userService';
import { type LinkPayload, type LinkListPayload } from '../types/payload';
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

router.patch(
  '/:slug',
  expressAsyncHandler(async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { userId } = req.user;
      const linkList = await linkListService.findOneBySlug(userId, slug);

      if (linkList === null) {
        throw new BadRequestErrror('Link list does not exist');
      }

      const updatedLinkList: LinkList = {
        ...linkList,
        ...req.body
      };

      if (updatedLinkList.links.length !== 0) {
        updatedLinkList.links = [];
      }

      const newUpdatedLinkList = await linkListService.save(updatedLinkList);

      res.send(newUpdatedLinkList);
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  '/:slug',
  expressAsyncHandler(async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { userId } = req.user;
      const result = await linkListService.deleteBySlug(userId, slug);

      if (result === 0) {
        throw new BadRequestErrror('Data was not deleted');
      }

      res.send({ message: 'Data was deleted' });
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  '/:slug/link/:id',
  expressAsyncHandler(async (req, res, next) => {
    try {
      const { slug } = req.params;
      const newLink = await linkListService.addLinkBySlug(
        req.body as LinkPayload,
        slug
      );

      res.send(newLink);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
