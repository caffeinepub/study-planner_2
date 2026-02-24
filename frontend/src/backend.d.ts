import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface OptionalTime {
    hour: bigint;
    minute: bigint;
}
export interface Assignment {
    id: AssignmentId;
    topic: string;
    content: ExternalBlob;
    level: string;
    language: string;
    length: string;
    timestamp: Time;
}
export type AnnouncementId = bigint;
export interface Announcement {
    id: AnnouncementId;
    message: string;
    timestamp: Time;
}
export type AssignmentId = bigint;
export interface StudyTaskPublic {
    id: bigint;
    created: Time;
    topic: string;
    duration: string;
    subject: string;
    isCompleted: boolean;
    date?: Time;
    subjectColor?: string;
    time?: OptionalTime;
    viewType?: StudyPlannerView;
    priority?: string;
}
export interface UserProfile {
    name: string;
}
export enum StudyPlannerView {
    daily = "daily",
    weekly = "weekly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTask(subject: string, topic: string, duration: string, priority: string | null, viewType: StudyPlannerView | null, subjectColor: string | null, date: Time | null, time: OptionalTime | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(message: string): Promise<void>;
    createAssignment(topic: string, level: string, length: string, language: string, content: ExternalBlob): Promise<Assignment>;
    deleteAnnouncement(id: AnnouncementId): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    dragDropReorder(newOrder: Array<bigint>): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllAssignments(): Promise<Array<Assignment>>;
    getAssignment(id: AssignmentId): Promise<Assignment | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFilteredTasks(view: StudyPlannerView | null): Promise<Array<StudyTaskPublic>>;
    getTaskCount(): Promise<bigint>;
    getTasks(): Promise<Array<StudyTaskPublic>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveConversationEntry(question: string, answer: string): Promise<void>;
    setView(view: StudyPlannerView): Promise<void>;
    submitFeatureRequest(message: string, email: string | null): Promise<void>;
    toggleTaskCompletion(taskId: bigint): Promise<void>;
    undoLastTask(): Promise<void>;
    updateTask(id: bigint, subject: string, topic: string, duration: string, priority: string | null, viewType: StudyPlannerView | null, subjectColor: string | null, date: Time | null, time: OptionalTime | null): Promise<void>;
}
