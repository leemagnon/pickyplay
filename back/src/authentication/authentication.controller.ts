import bcrypt from 'bcrypt';
import express from 'express';
import UserWithThatEmailAlreadyExistsException from '@exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialException from '@exceptions/WrongCredentialException';
import Controller from '@interfaces/controller.interface';
import validationMiddleware from '@middleware/validation.middleware';
import CreateUserDto from '@users/user.dto';