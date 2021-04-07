import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { OAuth2Client } from 'google-auth-library';

import User from "../models/User";
import usersView from "../views/users_view";
import { G_CLIENT, JWT_SECRET } from "../config/env_config";
import { ProfessionalBasic } from "../models/Professional";

const client = new OAuth2Client(G_CLIENT);

export default {
  
  async authenticate(request: Request, response: Response) {
    const usersRepository = getRepository(User);
    const { email, password } = request.body;

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      return response.sendStatus(401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return response.sendStatus(403);
    }

    const professionalRepository = getRepository(ProfessionalBasic);

    const professional = await professionalRepository.findOneOrFail({
      where: { user_id: user.id },
      relations: ["occupation"],
    });

    const permission = professional?.occupation?.permissions ? professional.occupation.permissions : 'HP';
    const token = jwt.sign({ id: user.id, clinic_id: user.clinic_id, professional_id: professional.id, admin: professional.admin, permissions: permission}, JWT_SECRET, { expiresIn: "1d" });
    return response.status(200).json({ user: usersView.render(user), token });
  },

  async authSocial(request: Request, response: Response) {
    const { email, idToken } = request.body;

    const ticket = await client.verifyIdToken({
      idToken : idToken,
      audience : G_CLIENT
    });

    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({where: {email}});

    if(!user){
      return response.status(401).json({message: "Usuário não cadastrado"});
    }
        
    // const payload = ticket.getPayload();
    // const userDetails = {
    //   email : payload?.email,
    //   firstname : payload?.given_name,
    //   lastname : payload?.family_name
    // }

    const professionalRepository = getRepository(ProfessionalBasic);

    const professional = await professionalRepository.findOneOrFail({
      where: { user_id: user.id },
      relations: ["occupation"],
    });
    const permission = professional?.occupation?.permissions ? professional.occupation.permissions : 'HP';
    const token = jwt.sign( {id: user.id, clinic_id: user.clinic_id, professional_id: professional.id, admin: professional.admin, permissions: permission }, JWT_SECRET, { expiresIn: "1d" });

    const dataInfo = {
      status: true,
      message: 'Login autorizado!',
      data: { user: usersView.render(user), token }
    }

    return response.status(200).json(dataInfo);
  },
};
