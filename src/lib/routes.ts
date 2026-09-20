import {projects,services} from './content';
import {articles} from './articles';
export const routes=['','projects','services','process','estimate','my-project','about','journal','contact','privacy','accessibility',...projects.map(p=>`projects/${p.slug}`),...services.map(s=>`services/${s.slug}`),...articles.map(a=>`journal/${a.slug}`)];
