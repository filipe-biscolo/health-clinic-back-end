import { Router } from "express";

import authMiddleware from "./middlewares/authMiddleware";

import AuthController from "./controllers/AuthController";
import UserController from "./controllers/UserController";
import PatientController from "./controllers/PatientController";
import ProfessionalController from "./controllers/ProfessionalController";
import AddressController from "./controllers/AddressController";
import UserQueueController from "./controllers/UserQueueController";
import ClinicController from "./controllers/ClinicController";
import OccupationController from "./controllers/OccupationController";
import HealthInsuranceController from "./controllers/HealthInsuranceController";
import ProcedureController from "./controllers/ProcedureController";
import UtilsController from "./controllers/UtilsController";
import ScheduleController from "./controllers/ScheduleController";
import AttendanceController from "./controllers/AttendanceController";
import ReportController from "./controllers/ReportController";

const routes = Router();

routes.post("/login", AuthController.authenticate);
routes.post("/login/social", AuthController.authSocial);

routes.post("/users", UserController.store);
routes.post("/users/forgot-password", UserController.createForgotPassword);
routes.put("/users/forgot-password", UserController.updateForgotPassword);
routes.put("/users/new-password", UserController.updatePassword);
routes.get("/users/new-password/verify", UserController.userForgotVerify);
routes.post("/signup", UserController.signUpAdmin);

routes.put("/signup/clinic/:id", ClinicController.signUpdate);

routes.post("/queue", UserQueueController.create);
routes.put("/queue", UserQueueController.update);
routes.post("/queue/social", UserQueueController.createSocial);
routes.get("/queue/verify", UserQueueController.queueVerify);

routes.get("/clinic/:id", authMiddleware, ClinicController.show);
routes.put("/clinic/:id", authMiddleware, ClinicController.update);

routes.get("/professionals", authMiddleware, ProfessionalController.index);
routes.get("/professionals/all", authMiddleware, ProfessionalController.indexAll);
routes.get("/professionals/export", authMiddleware, ProfessionalController.indexExport);
routes.get("/professionals/schedule", authMiddleware, ProfessionalController.indexSchedule);
routes.get("/professionals/:id", authMiddleware, ProfessionalController.show);
routes.post("/professionals", authMiddleware, ProfessionalController.create);
routes.put("/professionals/:id", authMiddleware, ProfessionalController.update);
routes.delete("/professionals/:id", authMiddleware, ProfessionalController.delete);
routes.get("/professionals/:id/hi", authMiddleware, ProfessionalController.indexHI);
routes.post("/professionals/hi", authMiddleware, ProfessionalController.createHI);
routes.delete("/professionals/hi/:id", authMiddleware, ProfessionalController.deleteHI);

routes.get("/patients", authMiddleware, PatientController.index);
routes.get("/patients/all", authMiddleware, PatientController.indexAll);
routes.get("/patients/export", authMiddleware, PatientController.indexExport);
routes.get("/patients/:id", authMiddleware, PatientController.show);
routes.post("/patients", authMiddleware, PatientController.create);
routes.put("/patients/:id", authMiddleware, PatientController.update);
routes.delete("/patients/:id", authMiddleware, PatientController.delete);

routes.get("/occupations", authMiddleware, OccupationController.index);
routes.get("/occupations/all", authMiddleware, OccupationController.indexAll);
routes.get("/occupations/export", authMiddleware, OccupationController.indexExport);
routes.get("/occupations/:id", authMiddleware, OccupationController.show);
routes.post("/occupations", authMiddleware, OccupationController.create);
routes.put("/occupations/:id", authMiddleware, OccupationController.update);
routes.delete("/occupations/:id", authMiddleware, OccupationController.delete);

routes.get("/health-insurances", authMiddleware, HealthInsuranceController.index);
routes.get("/health-insurances/all", authMiddleware, HealthInsuranceController.indexAll);
routes.get("/health-insurances/export", authMiddleware, HealthInsuranceController.indexExport);
routes.get("/health-insurances/:id", authMiddleware, HealthInsuranceController.show);
routes.post("/health-insurances", authMiddleware, HealthInsuranceController.create);
routes.put("/health-insurances/:id", authMiddleware, HealthInsuranceController.update);
routes.delete("/health-insurances/:id", authMiddleware, HealthInsuranceController.delete);

routes.get("/procedures", authMiddleware, ProcedureController.index);
routes.get("/procedures/all", authMiddleware, ProcedureController.indexAll);
routes.get("/procedures/export", authMiddleware, ProcedureController.indexExport);
routes.get("/procedures/:id", authMiddleware, ProcedureController.show);
routes.post("/procedures", authMiddleware, ProcedureController.create);
routes.put("/procedures/:id", authMiddleware, ProcedureController.update);
routes.delete("/procedures/:id", authMiddleware, ProcedureController.delete);

routes.get("/schedule", authMiddleware, ScheduleController.index);
routes.get("/schedule/all", authMiddleware, ScheduleController.indexAll);
routes.get("/schedule/export", authMiddleware, ScheduleController.indexExport);
routes.get("/schedule/:id", authMiddleware, ScheduleController.show);
routes.get("/schedule/detail/:id", authMiddleware, ScheduleController.showDetail);
routes.post("/schedule", authMiddleware, ScheduleController.create);
routes.put("/schedule/:id", authMiddleware, ScheduleController.update);
routes.delete("/schedule/:id", authMiddleware, ScheduleController.delete);

routes.get("/attendances", authMiddleware, AttendanceController.index);
routes.get("/attendances/export", authMiddleware, AttendanceController.indexExport);
routes.get("/attendances/:id", authMiddleware, AttendanceController.show);
routes.post("/attendances", authMiddleware, AttendanceController.create);
routes.put("/attendances/:id", authMiddleware, AttendanceController.update);

routes.get("/states", AddressController.indexStates);
routes.get("/states/:id", AddressController.showState);
routes.get("/cities/:state_id", AddressController.indexCities);
routes.get("/cities/detail/:id", AddressController.showCity);

routes.get("/data-header/:id", authMiddleware, UtilsController.dataConnectedUser);

routes.get("/reports/procedures", authMiddleware, ReportController.procedures);
routes.get("/reports/health-insurances", authMiddleware, ReportController.healthInsurances);
routes.get("/reports/professionals", authMiddleware, ReportController.professionals);
routes.get("/reports/patients", authMiddleware, ReportController.patients);
routes.get("/reports/scheduling-status", authMiddleware, ReportController.scheduleStatus);

export default routes;
