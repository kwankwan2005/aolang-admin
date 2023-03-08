import config from '../../config';
import Home from '../Home';
import LogIn from '../LogIn';
import User from '../User';
import { default as ApproveUser } from '../User/Approve';
import { default as ApproveQuestion } from '../Approve';
import Report from '../Approve/Report';
import { default as ApproveMarahurd } from '../Approve/Report/Marahurd';
import { default as ApproveVocab } from '../Approve/Report/Vocab';
import PendingQuestion from '../Approve/PendingQuestion';
import Dynamic from '../Dynamic';
import { default as DynamicMarahurd } from '../Dynamic/Marahurd';
import { default as MarahurdWebsite } from '../Dynamic/Marahurd/Website';
import { default as MarahurdFile } from '../Dynamic/Marahurd/File';
import Vocab from '../Dynamic/Vocab';
import { default as VocabWebsite } from '../Dynamic/Vocab/Website';
import { default as VocabFile } from '../Dynamic/Vocab/File';
import Manage from '../User/Manage';
import Tag from '../Dynamic/Marahurd/Tag';
import Static from '../Static';
import Content from '../Static/Content';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: LogIn },
    { path: config.routes.approve._, component: ApproveQuestion },
    { path: config.routes.approve.report._, component: Report },
    { path: config.routes.approve.report.marahurd, component: ApproveMarahurd },
    { path: config.routes.approve.report.vocab, component: ApproveVocab },
    { path: config.routes.approve.pending, component: PendingQuestion },
    { path: config.routes.user._, component: User },
    { path: config.routes.user.approve, component: ApproveUser },
    { path: config.routes.user.manage, component: Manage },
    { path: config.routes.dynamic._, component: Dynamic },
    { path: config.routes.dynamic.marahurd._, component: DynamicMarahurd },
    { path: config.routes.dynamic.marahurd.website, component: MarahurdWebsite },
    { path: config.routes.dynamic.marahurd.file, component: MarahurdFile },
    { path: config.routes.dynamic.marahurd.addtag, component: Tag },
    { path: config.routes.dynamic.vocab._, component: Vocab },
    { path: config.routes.dynamic.vocab.website, component: VocabWebsite },
    { path: config.routes.dynamic.vocab.file, component: VocabFile },
    { path: config.routes.static._, component: Static },
    { path: config.routes.static.content, component: Content },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
