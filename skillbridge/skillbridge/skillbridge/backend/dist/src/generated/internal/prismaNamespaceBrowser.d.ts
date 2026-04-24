import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: any;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: any;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: any;
export declare const ModelName: {
    readonly Institution: "Institution";
    readonly User: "User";
    readonly Batch: "Batch";
    readonly BatchTrainer: "BatchTrainer";
    readonly BatchStudent: "BatchStudent";
    readonly Session: "Session";
    readonly Attendance: "Attendance";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const InstitutionScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InstitutionScalarFieldEnum = (typeof InstitutionScalarFieldEnum)[keyof typeof InstitutionScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly clerkUserId: "clerkUserId";
    readonly name: "name";
    readonly email: "email";
    readonly role: "role";
    readonly institutionId: "institutionId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const BatchScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly institutionId: "institutionId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BatchScalarFieldEnum = (typeof BatchScalarFieldEnum)[keyof typeof BatchScalarFieldEnum];
export declare const BatchTrainerScalarFieldEnum: {
    readonly id: "id";
    readonly batchId: "batchId";
    readonly trainerId: "trainerId";
    readonly createdAt: "createdAt";
};
export type BatchTrainerScalarFieldEnum = (typeof BatchTrainerScalarFieldEnum)[keyof typeof BatchTrainerScalarFieldEnum];
export declare const BatchStudentScalarFieldEnum: {
    readonly id: "id";
    readonly batchId: "batchId";
    readonly studentId: "studentId";
    readonly createdAt: "createdAt";
};
export type BatchStudentScalarFieldEnum = (typeof BatchStudentScalarFieldEnum)[keyof typeof BatchStudentScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly batchId: "batchId";
    readonly trainerId: "trainerId";
    readonly title: "title";
    readonly date: "date";
    readonly startTime: "startTime";
    readonly endTime: "endTime";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const AttendanceScalarFieldEnum: {
    readonly id: "id";
    readonly sessionId: "sessionId";
    readonly studentId: "studentId";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AttendanceScalarFieldEnum = (typeof AttendanceScalarFieldEnum)[keyof typeof AttendanceScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
