/** Database contract for Drizzle + Neon. Add drizzle-orm and @neondatabase/serverless before wiring DATABASE_URL. */
export type Role = 'user' | 'business_owner' | 'moderator' | 'admin';
export type ContentStatus = 'published' | 'flagged' | 'removed';
export interface User { id:string; name:string; username:string; email:string; avatar?:string; bio?:string; location?:string; joinedAt:Date; reputation:number; role:Role }
export interface Business { id:string; name:string; category:string[]; address:string; city:string; state:string; zip:string; phone?:string; website?:string; hours:Record<string,string>; description?:string; claimed:boolean; ownerId?:string; averageRating:number; reviewCount:number; photos:string[] }
export interface Review { id:string; businessId:string; userId:string; rating:1|2|3|4|5; title:string; body:string; photos:string[]; createdAt:Date; editedAt?:Date; upvotes:number; downvotes:number; status:ContentStatus }
export interface Comment { id:string; reviewId:string; userId:string; parentCommentId?:string; body:string; createdAt:Date; upvotes:number; status:ContentStatus }
export interface Vote { id:string; userId:string; targetType:'review'|'comment'; targetId:string; value:'up'|'down' }
export interface Report { id:string; targetType:'review'|'comment'; targetId:string; reporterId:string; reason:string; status:'open'|'resolved'|'dismissed' }
export interface BusinessResponse { id:string; businessId:string; reviewId:string; responderId:string; body:string; createdAt:Date }
/** Phase 2: follows, business suggestions, photos and analytics events live in their own tables. */
