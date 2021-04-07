import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Clinic from "../models/Clinic";
import User from "../models/User";
import UserAdmin from "../models/UserAdmin";

import {Professional} from "../models/Professional";
import UserForgot from "../models/UserForgot";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env_config";

import * as nodemailer from "nodemailer";
import config from "../config/mail_config";
import { OAuth2Client } from "google-auth-library";
import UserQueue from "../models/UserQueue";
import jwt_decode from "jwt-decode";

const client = new OAuth2Client(
  "1047440820874-acsaelv1lfoif3d3pf205rjc6q96cq1f.apps.googleusercontent.com"
);

export default {
  async store(request: Request, response: Response) {
    const usersRepository = getRepository(User);
    const { email, password, clinic_id } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Usuário já está cadastrado!" });
    }

    const user = usersRepository.create({ email, password, clinic_id });
    await usersRepository.save(user);

    return response.status(201).json(user);
  },

  async signUpAdmin(request: Request, response: Response) {
    const usersRepository = getRepository(UserAdmin);
    const { email, person, type } = request.body;
    let { password } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      return response
        .status(409)
        .json({ message: "Usuário já está cadastrado!" });
    }

    const clinicData = {
      company_name: "",
      fantasy_name: "",
      cnpj: "",
      street: "",
      district: "",
      address_number: "",
      city_id: 0,
      state_id: 0,
      cep: "",
      phone: "",
    };
    const clinicRepository = getRepository(Clinic);

    const clinic = clinicRepository.create(clinicData);
    const __clinic = await clinicRepository.save(clinic);

    const professionalRepository = getRepository(Professional);

    type === "social" && (password = Math.random().toString(36).slice(-8));

    const data = {
      admin: true,
      clinic_id: __clinic.id,
      person,
      user: {
        clinic_id: __clinic.id,
        email,
        password,
      },
    };

    const professional = professionalRepository.create(data);

    const __professional = await professionalRepository.save(professional);

    const usersQueueRepository = getRepository(UserQueue);
    const userQueue = await usersQueueRepository.findOne({ where: { email } });

    if (!userQueue) {
      return response.status(404).json({ message: "E-mail não encontrado!" });
    }

    userQueue.confirmed = true;
    await usersQueueRepository.save(userQueue);

    const dataInfo = {
      status: true,
      message: "Cadastro de usuário realizado!",
      data: {
        professional: __professional,
      },
    };

    return response.status(201).json(dataInfo);
  },

  async updatePassword(request: Request, response: Response) {
    const usersRepository = getRepository(User);

    const { email, password } = request.body;

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      return response
        .status(404)
        .json({ message: "E-mail não está cadastrado" });
    }

    user.password = password;

    await usersRepository.save(user);

    const usersForgotRepository = getRepository(UserForgot);
    const userForgot = await usersForgotRepository.findOne({
      where: { email },
    });
    
    if (!userForgot) {
      return response
        .status(404)
        .json({ message: "Usuário não pediu a alteração da senha" });
    }

    userForgot.confirmed = true;
    await usersForgotRepository.save(userForgot);

    const dataInfo = {
      status: true,
      message: "Senha alterada com sucesso!",
      data: {
        email,
      },
    };

    return response.status(201).json(dataInfo);
  },

  async createForgotPassword(request: Request, response: Response) {
    const usersForgotRepository = getRepository(UserForgot);
    const usersRepository = getRepository(User);
    const { email } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });

    if (!userExists) {
      return response
        .status(404)
        .json({ message: "Email não está cadastrado!" });
    }

    const userForgotExists = await usersForgotRepository.findOne({
      where: { email },
    });

    if (userForgotExists && userForgotExists.confirmed === false) {
      return response
        .status(409)
        .json({
          message:
            "Você já pediu para recuperar a senha, verifique seu e-mail para corfirmar a alteração!",
        });
    }

    const code = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "1d" });

    if(userForgotExists && userForgotExists.confirmed === true){
      userForgotExists.code = code;
      userForgotExists.confirmed = false;
      await usersForgotRepository.save(userForgotExists);
    } else {
      const new_recover = usersForgotRepository.create({
        email,
        confirmed: false,
        code,
      });
      await usersForgotRepository.save(new_recover);
    }

    const message = `
    <h4>Confime seu pedido de recuperação de senha no Health Clinic</h4>
    <p>Clique no link abaixo para recuperar a sua senha</p>
    <a href="http://localhost:4200/forgot-password/new?email=${email}&code=${code}">Recuperar senha</a>`;

    const mailOptions = {
      from: "filipe.biscolo@gmail.com",
      to: email,
      subject: "Health Clinic - Recuperação de senha",
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

  async updateForgotPassword(request: Request, response: Response) {
    const usersForgotRepository = getRepository(UserForgot);
    const usersRepository = getRepository(User);
    const { email } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });
    
    if (!userExists) {
      return response
        .status(404)
        .json({ message: "E-mail não está cadastrado!" });
    }

    const userForgotExists = await usersForgotRepository.findOne({
      where: { email },
    });

    if (!userForgotExists) {
      return response.status(404).json({ message: "E-mail não encontrado!" });
    }

    const code = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "1d" });
    userForgotExists.code = code;
    await usersForgotRepository.save(userForgotExists);

    const message = `
  <h4>Confime seu pedido de recuperação de senha no Health Clinic</h4>
  <p>Clique no link abaixo para recuperar a sua senha</p>
  <a href="http://localhost:4200/forgot-password/new?email=${email}&code=${code}">Recuperar senha</a>`;

    const mailOptions = {
      from: "filipe.biscolo@gmail.com",
      to: email,
      subject: "Health Clinic - Recuperação de senha",
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

  async userForgotVerify(request: Request, response: Response) {
    const userForgotRepository = getRepository(UserForgot);
    const usersRepository = getRepository(User);
    const { user_email, code } = request.query;

    const { email, name, exp } = jwt_decode(code as string) as any;

    const expiration = new Date(exp * 1000);

    const userExists = await usersRepository.findOne({
      where: { email: user_email },
    });

    const userForgotExists = await userForgotRepository.findOne({
      where: { email: user_email },
    });

    if (!userExists) {
      const dataInfo = {
        status: false,
        message: "Usuário não está cadastrado!",        
        data: { state: "invalidEmail" }
      };
      return response.status(404).json(dataInfo);
    }

    if (!userForgotExists || user_email !== email) {
      const dataInfo = {
        status: false,
        message: "E-mail inválido!",
        data: { state: "invalidEmail" }
      };
      return response.status(404).json(dataInfo);
    }
    
    if (userForgotExists.code !== code || expiration < new Date()) {
      const dataInfo = {
        status: false,
        message: "Confirmação expirada!",
        data: { state: "invalidToken" },
      };
      return response.status(498).json(dataInfo);
    }

    const dataInfo = {
      status: true,
      message: "Informações corretas!",
      data: { name },
    };
    return response.status(200).json(dataInfo);
  },
};
