import { G_MAILU, G_MAILP, P_MAIL } from "../config/env_config";

class Configs {
    public host = "smtp.gmail.com";
    public port = Number(P_MAIL);
    public user = G_MAILU;
    public password = G_MAILP;
}

export default new Configs;