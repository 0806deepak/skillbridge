import * as runtime from "@prisma/client/runtime/library";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Institutions
 * const institutions = await prisma.institution.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Institution
 *
 */
export type Institution = Prisma.InstitutionModel;
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Batch
 *
 */
export type Batch = Prisma.BatchModel;
/**
 * Model BatchTrainer
 *
 */
export type BatchTrainer = Prisma.BatchTrainerModel;
/**
 * Model BatchStudent
 *
 */
export type BatchStudent = Prisma.BatchStudentModel;
/**
 * Model Session
 *
 */
export type Session = Prisma.SessionModel;
/**
 * Model Attendance
 *
 */
export type Attendance = Prisma.AttendanceModel;
