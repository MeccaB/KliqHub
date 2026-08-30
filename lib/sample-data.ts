export type Business = { id:string; name:string; category:string; location:string; rating:number; reviews:number; tone:'blue'|'green'|''; description:string };
export const businesses: Business[] = [
 {id:'harbor-table',name:'Harbor & Table',category:'Restaurants',location:'Portland, OR',rating:4.8,reviews:327,tone:'',description:'Seasonal Pacific Northwest plates in a warm waterfront setting.'},
 {id:'ridge-auto',name:'Ridge Auto Care',category:'Auto Repair',location:'Austin, TX',rating:4.7,reviews:184,tone:'blue',description:'Straightforward service and dependable repairs from local technicians.'},
 {id:'willow-home',name:'Willow Home Services',category:'Home Services',location:'Columbus, OH',rating:4.9,reviews:92,tone:'green',description:'Trusted local pros for the repairs that keep home feeling like home.'},
];
export const reviews = [
 {id:'r-1',author:'Maya L.',initials:'ML',rating:5,title:'The kind of service you want to tell people about',body:'We came in on a busy Saturday and still felt genuinely looked after. Every recommendation landed, and the team made the whole evening easy.',helpful:42,date:'2 days ago'},
 {id:'r-2',author:'Jordan R.',initials:'JR',rating:4,title:'Great experience, plan ahead',body:'Excellent quality and a thoughtful staff. Reservations are a good idea, especially on weekends.',helpful:18,date:'1 week ago'},
];
