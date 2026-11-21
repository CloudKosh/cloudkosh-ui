import DateTime from "@web-atoms/date-time/dist/DateTime.js";
import type IClrEntity from "@web-atoms/entity/dist/models/IClrEntity.js";
import { ICollection, IGeometry, IModel, Model, DefaultFactory } from "@web-atoms/entity/dist/services/BaseEntityService.js";
export type IGeometryType = IGeometry;


export const modelEntitySchemas = {};

export interface IAccessToken extends IClrEntity {
	readonly tokenID?: number;
	userID?: number;
	secretHash?: any;
	title?: string | null;
	description?: string | null;
	dateCreated?: DateTime;
	lastUsed?: DateTime | null;
	active?: boolean;
	displaySecret?: Object;
	user?: IUser;
}

export const AccessToken: IModel<IAccessToken,any,any> = new Model<IAccessToken>(
"AccessToken",
[
"tokenID"
],
{ dateCreated: new DefaultFactory(() => new DateTime()),active: false },
{
"name": "access_tokens",
"keys": [
{
"name": "tokenID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "userID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "secretHash",
"type": "Buffer",
"dataType": "ByteArray"
},
{
"name": "title",
"type": "string",
"dataType": "Char",
"length": 400,
"default": [
"title",
"\"\""
]
},
{
"name": "description",
"type": "string",
"dataType": "Char",
"default": [
"description",
"\"\""
]
},
{
"name": "dateCreated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateCreated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "lastUsed",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"lastUsed",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "active",
"type": "boolean",
"dataType": "Boolean",
"default": [
"active",
"false"
]
}
],
"relations": [
{
"name": "user",
"fkMap": [
{
"fk": "userID",
"relatedKey": "userID"
}
],
"relatedName": "User"
}
]
}
);
modelEntitySchemas["AccessToken"] = AccessToken;

export interface IDbLock extends IClrEntity {
	lockID?: string;
	lockSecret?: string | null;
	lockTTL?: DateTime | null;
}

export const DbLock: IModel<IDbLock,any,any> = new Model<IDbLock>(
"DbLock",
[
"lockID"
],
{  },
{
"name": "db_locks",
"keys": [
{
"name": "lockID",
"type": "string",
"dataType": "Char",
"length": 400
}
],
"properties": [
{
"name": "lockSecret",
"type": "string",
"dataType": "Char",
"length": 80,
"default": [
"lockSecret",
"\"\""
]
},
{
"name": "lockTTL",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"lockTTL",
"new DefaultFactory(() => new DateTime())"
]
}
],
"relations": []
}
);
modelEntitySchemas["DbLock"] = DbLock;

export interface IBucket extends IClrEntity {
	readonly bucketID?: number;
	namespaceID?: number;
	name?: string;
	host?: string;
	dateCreated?: DateTime;
	size?: number;
	namespace?: INamespace;
	bucketFiles?: ICollection<IBucketFile>;
}

export const Bucket: IModel<IBucket,any,any> = new Model<IBucket>(
"Bucket",
[
"bucketID"
],
{ name: "",host: "",dateCreated: new DefaultFactory(() => new DateTime()),size: 0 },
{
"name": "buckets",
"keys": [
{
"name": "bucketID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "namespaceID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "name",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"name",
"\"\""
]
},
{
"name": "host",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"host",
"\"\""
]
},
{
"name": "dateCreated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateCreated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "size",
"type": "number",
"dataType": "BigInt",
"default": [
"size",
"0"
]
}
],
"relations": [
{
"name": "namespace",
"fkMap": [
{
"fk": "namespaceID",
"relatedKey": "id"
}
],
"relatedName": "Namespace"
},
{
"name": "bucketFiles",
"isCollection": true,
"isInverse": true,
"relatedName": "BucketFile"
}
]
}
);
modelEntitySchemas["Bucket"] = Bucket;

export interface IBucketFile extends IClrEntity {
	readonly bucketFileID?: number;
	bucketID?: number;
	path?: string;
	contentType?: string;
	size?: number;
	dateCreated?: DateTime;
	dateUpdated?: DateTime;
	readonly depth?: number;
	bucket?: IBucket;
	versions?: ICollection<IBucketFileVersion>;
	blocks?: ICollection<IFileBlock>;
}

export const BucketFile: IModel<IBucketFile,any,any> = new Model<IBucketFile>(
"BucketFile",
[
"bucketFileID"
],
{ path: "",contentType: "",size: 0,dateCreated: new DefaultFactory(() => new DateTime()),dateUpdated: new DefaultFactory(() => new DateTime()) },
{
"name": "bucket_files",
"keys": [
{
"name": "bucketFileID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "bucketID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "path",
"type": "string",
"dataType": "Char",
"length": 1024,
"default": [
"path",
"\"\""
]
},
{
"name": "contentType",
"type": "string",
"dataType": "Char",
"length": 400,
"default": [
"contentType",
"\"\""
]
},
{
"name": "size",
"type": "number",
"dataType": "BigInt",
"default": [
"size",
"0"
]
},
{
"name": "dateCreated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateCreated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "dateUpdated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateUpdated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "depth",
"type": "number",
"generated": "computed",
"dataType": "Int"
}
],
"relations": [
{
"name": "bucket",
"fkMap": [
{
"fk": "bucketID",
"relatedKey": "bucketID"
}
],
"relatedName": "Bucket"
},
{
"name": "versions",
"isCollection": true,
"isInverse": true,
"relatedName": "BucketFileVersion"
},
{
"name": "blocks",
"isCollection": true,
"isInverse": true,
"relatedName": "FileBlock"
}
]
}
);
modelEntitySchemas["BucketFile"] = BucketFile;

export interface IBucketFileVersion extends IClrEntity {
	readonly versionID?: number;
	fileID?: number;
	dateCreated?: DateTime;
	file?: IBucketFile;
	versionBlocks?: ICollection<IFileVersionBlock>;
}

export const BucketFileVersion: IModel<IBucketFileVersion,any,any> = new Model<IBucketFileVersion>(
"BucketFileVersion",
[
"versionID"
],
{ dateCreated: new DefaultFactory(() => new DateTime()) },
{
"name": "bucket_file_versions",
"keys": [
{
"name": "versionID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "fileID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "dateCreated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateCreated",
"new DefaultFactory(() => new DateTime())"
]
}
],
"relations": [
{
"name": "file",
"fkMap": [
{
"fk": "fileID",
"relatedKey": "bucketFileID"
}
],
"relatedName": "BucketFile"
},
{
"name": "versionBlocks",
"isCollection": true,
"isInverse": true,
"relatedName": "FileVersionBlock"
}
]
}
);
modelEntitySchemas["BucketFileVersion"] = BucketFileVersion;

export interface IFileBlock extends IClrEntity {
	fileID?: number;
	contentID?: number;
	order?: number;
	file?: IBucketFile;
	content?: INamespaceContent;
}

export const FileBlock: IModel<IFileBlock,any,any> = new Model<IFileBlock>(
"FileBlock",
[
"fileID",
"contentID",
"order"
],
{  },
{
"name": "file_blocks",
"keys": [
{
"name": "fileID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "contentID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "order",
"type": "number",
"dataType": "BigInt"
}
],
"properties": [],
"relations": [
{
"name": "file",
"fkMap": [
{
"fk": "fileID",
"relatedKey": "bucketFileID"
}
],
"relatedName": "BucketFile"
},
{
"name": "content",
"fkMap": [
{
"fk": "contentID",
"relatedKey": "contentID"
}
],
"relatedName": "NamespaceContent"
}
]
}
);
modelEntitySchemas["FileBlock"] = FileBlock;

export interface IFileVersionBlock extends IClrEntity {
	versionID?: number;
	contentID?: number;
	orderID?: number;
	fileVersion?: IBucketFileVersion;
	content?: INamespaceContent;
}

export const FileVersionBlock: IModel<IFileVersionBlock,any,any> = new Model<IFileVersionBlock>(
"FileVersionBlock",
[
"versionID",
"contentID",
"orderID"
],
{  },
{
"name": "file_version_blocks",
"keys": [
{
"name": "versionID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "contentID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "orderID",
"type": "number",
"dataType": "BigInt"
}
],
"properties": [],
"relations": [
{
"name": "fileVersion",
"fkMap": [
{
"fk": "versionID",
"relatedKey": "versionID"
}
],
"relatedName": "BucketFileVersion"
},
{
"name": "content",
"fkMap": [
{
"fk": "contentID",
"relatedKey": "contentID"
}
],
"relatedName": "NamespaceContent"
}
]
}
);
modelEntitySchemas["FileVersionBlock"] = FileVersionBlock;

export interface ILoginSession extends IClrEntity {
	readonly sessionID?: number;
	userID?: number;
	invalid?: boolean;
	dateUpdated?: DateTime;
	status?: string;
	ipAddress?: string | null;
	deviceToken?: string | null;
	deviceTokenType?: "WebPush" | "fcm" | "apn" | null;
	verificationToken?: number | null;
	userName?: string;
	checkPassword?: string;
	passwordIsAccessToken?: boolean;
	newPassword?: string;
	/** Multi Factor Auth Token */
	timeToken?: string;
	/** One Time Password */
	oneTimePassword?: string;
	user?: IUser;
}

export const LoginSessionDeviceTokenTypeArray = [
{
"label": "WebPush",
"value": "WebPush"
},
{
"label": "fcm",
"value": "fcm"
},
{
"label": "apn",
"value": "apn"
}
];

export const LoginSession: IModel<ILoginSession,any,any> = new Model<ILoginSession>(
"LoginSession",
[
"sessionID"
],
{ invalid: false,dateUpdated: new DefaultFactory(() => new DateTime()),status: "" },
{
"name": "login_sessions",
"keys": [
{
"name": "sessionID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "userID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "start",
"type": "DateTime",
"dataType": "DateTimeOffset",
"default": [
"start",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "expiry",
"type": "DateTime",
"dataType": "DateTimeOffset",
"default": [
"expiry",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "invalid",
"type": "boolean",
"dataType": "Boolean",
"default": [
"invalid",
"false"
]
},
{
"name": "dateUpdated",
"type": "DateTime",
"dataType": "DateTimeOffset",
"default": [
"dateUpdated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "status",
"type": "string",
"dataType": "AsciiChar",
"length": 40,
"default": [
"status",
"\"\""
]
},
{
"name": "ipAddress",
"type": "string",
"dataType": "Char",
"length": 50,
"default": [
"ipAddress",
"\"\""
]
},
{
"name": "deviceToken",
"type": "string",
"dataType": "AsciiChar",
"default": [
"deviceToken",
"\"\""
]
},
{
"name": "deviceTokenType",
"type": "string",
"dataType": "AsciiChar",
"length": 50,
"default": [
"deviceTokenType",
"\"WebPush\""
]
},
{
"name": "verificationToken",
"type": "number",
"dataType": "Int",
"default": [
"verificationToken",
"0"
]
}
],
"relations": [
{
"name": "user",
"fkMap": [
{
"fk": "userID",
"relatedKey": "userID"
}
],
"relatedName": "User"
}
]
}
);
modelEntitySchemas["LoginSession"] = LoginSession;

export interface INamespace extends IClrEntity {
	readonly id?: number;
	name?: string;
	description?: string | null;
	dateCreated?: DateTime;
	size?: number;
	buckets?: ICollection<IBucket>;
	contents?: ICollection<INamespaceContent>;
	storages?: ICollection<INamespaceStorage>;
	namespaceUsers?: ICollection<INamespaceUser>;
}

export const Namespace: IModel<INamespace,any,any> = new Model<INamespace>(
"Namespace",
[
"id"
],
{ name: "",dateCreated: new DefaultFactory(() => new DateTime()),size: 0 },
{
"name": "namespaces",
"keys": [
{
"name": "id",
"type": "number",
"generated": "identity",
"dataType": "Char"
}
],
"properties": [
{
"name": "name",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"name",
"\"\""
]
},
{
"name": "description",
"type": "string",
"dataType": "Char",
"default": [
"description",
"\"\""
]
},
{
"name": "dateCreated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateCreated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "size",
"type": "number",
"dataType": "BigInt",
"default": [
"size",
"0"
]
}
],
"relations": [
{
"name": "buckets",
"isCollection": true,
"isInverse": true,
"relatedName": "Bucket"
},
{
"name": "contents",
"isCollection": true,
"isInverse": true,
"relatedName": "NamespaceContent"
},
{
"name": "storages",
"isCollection": true,
"isInverse": true,
"relatedName": "NamespaceStorage"
},
{
"name": "namespaceUsers",
"isCollection": true,
"isInverse": true,
"relatedName": "NamespaceUser"
}
]
}
);
modelEntitySchemas["Namespace"] = Namespace;

export interface INamespaceContent extends IClrEntity {
	readonly contentID?: number;
	namespaceID?: number;
	sha256?: any;
	size?: number;
	stale?: boolean;
	keyPath?: string;
	namespace?: INamespace;
	fileBlocks?: ICollection<IFileBlock>;
	fileVersionBlocks?: ICollection<IFileVersionBlock>;
	storageContents?: ICollection<IStorageContent>;
}

export const NamespaceContent: IModel<INamespaceContent,any,any> = new Model<INamespaceContent>(
"NamespaceContent",
[
"contentID"
],
{ size: 0,stale: false,keyPath: "" },
{
"name": "namespace_contents",
"keys": [
{
"name": "contentID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "namespaceID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "sha256",
"type": "Buffer",
"dataType": "ByteArray"
},
{
"name": "size",
"type": "number",
"dataType": "BigInt",
"default": [
"size",
"0"
]
},
{
"name": "stale",
"type": "boolean",
"dataType": "Boolean",
"default": [
"stale",
"false"
]
},
{
"name": "keyPath",
"type": "string",
"dataType": "Char",
"length": 1024,
"default": [
"keyPath",
"\"\""
]
}
],
"relations": [
{
"name": "namespace",
"fkMap": [
{
"fk": "namespaceID",
"relatedKey": "id"
}
],
"relatedName": "Namespace"
},
{
"name": "fileBlocks",
"isCollection": true,
"isInverse": true,
"relatedName": "FileBlock"
},
{
"name": "fileVersionBlocks",
"isCollection": true,
"isInverse": true,
"relatedName": "FileVersionBlock"
},
{
"name": "storageContents",
"isCollection": true,
"isInverse": true,
"relatedName": "StorageContent"
}
]
}
);
modelEntitySchemas["NamespaceContent"] = NamespaceContent;

export interface INamespaceStorage extends IClrEntity {
	readonly storageID?: number;
	namespaceID?: number;
	name?: string;
	readPriority?: number;
	writePriority?: number;
	type?: string;
	bucket?: string;
	endpoint?: string | null;
	region?: string | null;
	encryptedAccessKeyID?: string;
	encryptedKeySecret?: string;
	namespace?: INamespace;
	storageContents?: ICollection<IStorageContent>;
}

export const NamespaceStorage: IModel<INamespaceStorage,any,any> = new Model<INamespaceStorage>(
"NamespaceStorage",
[
"storageID"
],
{ name: "",readPriority: 0,writePriority: 0,type: "",bucket: "",encryptedAccessKeyID: "",encryptedKeySecret: "" },
{
"name": "namespace_storages",
"keys": [
{
"name": "storageID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "namespaceID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "name",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"name",
"\"\""
]
},
{
"name": "readPriority",
"type": "number",
"dataType": "Int",
"default": [
"readPriority",
"0"
]
},
{
"name": "writePriority",
"type": "number",
"dataType": "Int",
"default": [
"writePriority",
"0"
]
},
{
"name": "type",
"type": "string",
"dataType": "Char",
"length": 100,
"default": [
"type",
"\"\""
]
},
{
"name": "bucket",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"bucket",
"\"\""
]
},
{
"name": "endpoint",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"endpoint",
"\"\""
]
},
{
"name": "region",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"region",
"\"\""
]
},
{
"name": "encryptedAccessKeyID",
"type": "string",
"dataType": "Char",
"length": 400,
"default": [
"encryptedAccessKeyID",
"\"\""
]
},
{
"name": "encryptedKeySecret",
"type": "string",
"dataType": "Char",
"length": 400,
"default": [
"encryptedKeySecret",
"\"\""
]
}
],
"relations": [
{
"name": "namespace",
"fkMap": [
{
"fk": "namespaceID",
"relatedKey": "id"
}
],
"relatedName": "Namespace"
},
{
"name": "storageContents",
"isCollection": true,
"isInverse": true,
"relatedName": "StorageContent"
}
]
}
);
modelEntitySchemas["NamespaceStorage"] = NamespaceStorage;

export interface INamespaceUser extends IClrEntity {
	namespaceID?: number;
	userID?: number;
	namespace?: INamespace;
	user?: IUser;
}

export const NamespaceUser: IModel<INamespaceUser,any,any> = new Model<INamespaceUser>(
"NamespaceUser",
[
"namespaceID",
"userID"
],
{  },
{
"name": "namespace_users",
"keys": [
{
"name": "namespaceID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "userID",
"type": "number",
"dataType": "BigInt"
}
],
"properties": [],
"relations": [
{
"name": "namespace",
"fkMap": [
{
"fk": "namespaceID",
"relatedKey": "id"
}
],
"relatedName": "Namespace"
},
{
"name": "user",
"fkMap": [
{
"fk": "userID",
"relatedKey": "userID"
}
],
"relatedName": "User"
}
]
}
);
modelEntitySchemas["NamespaceUser"] = NamespaceUser;

export interface IStorageContent extends IClrEntity {
	contentID?: number;
	storageID?: number;
	ready?: boolean;
	content?: INamespaceContent;
	storage?: INamespaceStorage;
}

export const StorageContent: IModel<IStorageContent,any,any> = new Model<IStorageContent>(
"StorageContent",
[
"contentID",
"storageID"
],
{ ready: false },
{
"name": "storage_contents",
"keys": [
{
"name": "contentID",
"type": "number",
"dataType": "BigInt"
},
{
"name": "storageID",
"type": "number",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "ready",
"type": "boolean",
"dataType": "Boolean",
"default": [
"ready",
"false"
]
}
],
"relations": [
{
"name": "content",
"fkMap": [
{
"fk": "contentID",
"relatedKey": "contentID"
}
],
"relatedName": "NamespaceContent"
},
{
"name": "storage",
"fkMap": [
{
"fk": "storageID",
"relatedKey": "storageID"
}
],
"relatedName": "NamespaceStorage"
}
]
}
);
modelEntitySchemas["StorageContent"] = StorageContent;

export interface IUser extends IClrEntity {
	readonly userID?: number;
	status?: "active" | "blocked" | "locked";
	displayName?: string | null;
	emailAddress?: string;
	dateCreated?: DateTime;
	roles?: string;
	accessTokens?: ICollection<IAccessToken>;
	sessions?: ICollection<ILoginSession>;
	namespaceUsers?: ICollection<INamespaceUser>;
}

export const UserStatusArray = [
{
"label": "active",
"value": "active"
},
{
"label": "blocked",
"value": "blocked"
},
{
"label": "locked",
"value": "locked"
}
];

export const User: IModel<IUser,any,any> = new Model<IUser>(
"User",
[
"userID"
],
{ status: "active",emailAddress: "",dateCreated: new DefaultFactory(() => new DateTime()),roles: "" },
{
"name": "users",
"keys": [
{
"name": "userID",
"type": "number",
"generated": "identity",
"dataType": "BigInt"
}
],
"properties": [
{
"name": "status",
"type": "string",
"dataType": "Char",
"length": 20,
"default": [
"status",
"\"active\""
]
},
{
"name": "displayName",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"displayName",
"\"\""
]
},
{
"name": "emailAddress",
"type": "string",
"dataType": "Char",
"length": 200,
"default": [
"emailAddress",
"\"\""
]
},
{
"name": "dateCreated",
"type": "DateTime",
"dataType": "DateTime",
"default": [
"dateCreated",
"new DefaultFactory(() => new DateTime())"
]
},
{
"name": "roles",
"type": "string",
"dataType": "Char",
"length": 400,
"default": [
"roles",
"\"\""
]
}
],
"relations": [
{
"name": "accessTokens",
"isCollection": true,
"isInverse": true,
"relatedName": "AccessToken"
},
{
"name": "sessions",
"isCollection": true,
"isInverse": true,
"relatedName": "LoginSession"
},
{
"name": "namespaceUsers",
"isCollection": true,
"isInverse": true,
"relatedName": "NamespaceUser"
}
]
}
);
modelEntitySchemas["User"] = User;

const fixRelatedSchemas = (schema) => {
for (const key in schema) {
if (Object.prototype.hasOwnProperty.call(schema, key)) {
const element = schema[key];
if (!element.name) {
continue;
}
const { relations } = element.schema;
if (!relations) {
continue;
}
for (const iterator of relations) {
iterator.relatedModel = schema[iterator.relatedName];
}
}
}
};
fixRelatedSchemas(modelEntitySchemas);
