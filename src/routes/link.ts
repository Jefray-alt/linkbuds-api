import { type LinkList } from '../entity/LinkList.entity';
import LinkListService from '../service/linkListService';
import UserService from '../service/userService';
import { type LinkListPayload } from '../types/payload';
import { BadRequestErrror } from '../utils/errors';
import {
  CreateLinkListValidation,
  UpdateLinkListValidation
} from '../validations/LinkList/LinkList.validations';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const router = Router();
const linkListService = new LinkListService();
const userService = new UserService();

router.post(
  '/',
  expressAsyncHandler(async (req, res, next) => {
    try {
      await CreateLinkListValidation.validateAsync(req.body);

      const user = await userService.findById(req.user.userId);

      if (user === null) {
        throw new Error('User not found');
      }

      const linkListPayload = req.body as LinkListPayload;
      linkListPayload.user = user;

      const linkList = await linkListService.create(linkListPayload);
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
      const payload = req.body as LinkListPayload;

      await UpdateLinkListValidation.validateAsync(payload);

      const linkList = await linkListService.findOneBySlug(userId, slug);

      if (linkList === null) {
        throw new BadRequestErrror('Link list does not exist');
      }

      // eslint-disable-next-line eqeqeq
      if (payload.slug != undefined) {
        throw new BadRequestErrror('Slug cannot be updated');
      }

      const updatedLinkList: LinkList = {
        ...linkList,
        ...req.body
      };

      const newUpdatedLinkList = await linkListService.updateBySlug(
        userId,
        updatedLinkList
      );

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

      const result = await linkListService.softDeleteBySlug(userId, slug);

      if (result === 0) {
        throw new BadRequestErrror('Data was not deleted');
      }

      res.send({ message: 'Data was deleted' });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
