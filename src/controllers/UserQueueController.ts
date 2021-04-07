import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";
import UserQueue from "../models/UserQueue";

import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { G_CLIENT, JWT_SECRET } from "../config/env_config";

import * as nodemailer from "nodemailer";
import config from "../config/mail_config";
import { OAuth2Client } from "google-auth-library";

export default {
  async create(request: Request, response: Response) {
    const usersQueueRepository = getRepository(UserQueue);
    const usersRepository = getRepository(User);
    const { email } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Usuário já está cadastrado!", type: "USER" });
    }

    const userQueueExists = await usersQueueRepository.findOne({
      where: { email },
    });

    if (userQueueExists) {
      return response.status(409).json({
        message:
          "Você já se cadastrou, verifique seu e-mail para ativar sua conta!",
        type: "QUEUE",
      });
    }

    const code = jwt.sign({ email: email, type: "mail" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const new_user = usersQueueRepository.create({
      email,
      confirmed: false,
      code,
    });
    await usersQueueRepository.save(new_user);

    const message = `
        <h4>Confime seu cadastro no Health Clinic</h4>
        <p>Clique no link abaixo para confirmar o seu cadastro</p>
        <a href="http://localhost:4200/signup/form?email=${email}&code=${code}">Confirmar cadastro</a>`;

    const mailOptions = {
      from: "filipe.biscolo@gmail.com",
      to: email,
      subject: "Health Clinic - Confirme seu cadastro",
      html: message,
    };

    const transporter = await nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: { rejectUnauthorized: false },
    });

    const dataInfo = {
      status: true,
      message: "Um e-mail de confirmação foi enviado para o seu e-mail!",
      data: {
        email,
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        response.status(500).json({ result: error });
      } else {
        response.status(200).json(dataInfo);
      }
    });
  },

  async createSocial(request: Request, response: Response) {
    const client = new OAuth2Client(G_CLIENT);
    const usersQueueRepository = getRepository(UserQueue);
    const usersRepository = getRepository(User);
    const { email, idToken } = request.body;

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: G_CLIENT,
    });

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Usuário já está cadastrado!", type: "USER" });
    }

    const userQueueExists = await usersQueueRepository.findOne({
      where: { email },
    });

    if (userQueueExists) {
      const payload = ticket.getPayload();
      const userDetails = {
        email: payload?.email,
        firstname: payload?.given_name,
        lastname: payload?.family_name,
      };

      const code = jwt.sign(
        {
          email: email,
          type: "social",
          name: `${userDetails.firstname} ${userDetails.lastname}`,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      userQueueExists.code = code;
      await usersQueueRepository.save(userQueueExists);

      const dataInfo = {
        status: true,
        message: "Pré cadastro realizado com sucesso",
        data: {
          type: "google",
          email,
          code,
        },
      };
      return response.status(201).json(dataInfo);
    }

    const payload = ticket.getPayload();
    const userDetails = {
      email: payload?.email,
      firstname: payload?.given_name,
      lastname: payload?.family_name,
    };

    const code = jwt.sign(
      {
        email: email,
        type: "social",
        name: `${userDetails.firstname} ${userDetails.lastname}`,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const new_user = usersQueueRepository.create({
      email,
      confirmed: false,
      code,
    });
    await usersQueueRepository.save(new_user);

    const dataInfo = {
      status: true,
      message: "Pré cadastro realizado com sucesso",
      data: {
        type: "google",
        email,
        code,
      },
    };
    return response.status(201).json(dataInfo);
  },

  async update(request: Request, response: Response) {
    const usersQueueRepository = getRepository(UserQueue);
    const usersRepository = getRepository(User);
    const { email } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Usuário já está cadastrado!" });
    }

    const userQueue = await usersQueueRepository.findOne({ where: { email } });

    if (!userQueue) {
      return response.status(404).json({
        message: "E-mail não encontrado, tente novamente mais tarde!",
      });
    }

    const code = jwt.sign({ email: email, type: "mail" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    userQueue.code = code;

    await usersQueueRepository.save(userQueue);

    const message = `
        <h4>Confime seu cadastro no Health Clinic</h4>
        <p>Clique no link abaixo para confirmar o seu cadastro</p>
        <a href="http://localhost:4200/signup/form?email=${email}&code=${code}">Confirmar cadastro</a>`;

    const mailOptions = {
      from: "filipe.biscolo@gmail.com",
      to: email,
      subject: "Health Clinic - Confirme seu cadastro",
      html: message,
    };

    const transporter = await nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: { rejectUnauthorized: false },
    });

    const dataInfo = {
      status: true,
      message: "Um e-mail de confirmação foi enviado para o seu e-mail!",
      data: {
        email,
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        response.status(500).json({ result: error });
      } else {
        response.status(200).json(dataInfo);
      }
    });
  },

  async queueVerify(request: Request, response: Response) {
    const usersQueueRepository = getRepository(UserQueue);
    const usersRepository = getRepository(User);
    const { user_email, code } = request.query;

    const { email, name, type, exp } = jwt_decode(code as string) as any;

    const expiration = new Date(exp * 1000);

    const userExists = await usersRepository.findOne({
      where: { email: user_email },
    });

    const userQueueExists = await usersQueueRepository.findOne({
      where: { email: user_email },
    });

    if (userExists) {
      if (
        userQueueExists &&
        userQueueExists.code === code &&
        userQueueExists.confirmed === true &&
        expiration > new Date()
      ) {
        const dataInfo = {
          status: true,
          message: "Usuário encontrado, finalize o cadastro!",
          data: { state: "userFound", clinic_id: userExists.clinic_id, type },
        };
        return response.status(202).json(dataInfo);
      }

      const dataInfo = {
        status: false,
        message: "Usuário já está cadastrado!",
        data: { state: "userExists", type },
      };
      return response.status(409).json(dataInfo);
    }

    if (!userQueueExists || user_email !== email) {
      const dataInfo = {
        status: false,
        message: "E-mail inválido!",
        data: { state: "invalidEmail", type },
      };
      return response.status(404).json(dataInfo);
    }
    
    if (userQueueExists.code !== code || expiration < new Date()) {
      const dataInfo = {
        status: false,
        message: "Confirmação expirada!",
        data: { state: "invalidToken", type },
      };
      return response.status(498).json(dataInfo);
    }

    const dataInfo = {
      status: true,
      message: "Informações corretas!",
      data: { name, type },
    };
    return response.status(200).json(dataInfo);
  },
};
