import * as Koa from 'koa';
import * as Compose from 'koa-compose';
import * as Bodyparser from 'koa-bodyparser';
import * as Session from 'koa-session-minimal';
import { WebApiRouter } from 'webapi-router';
import sessionHandle from './session_handle';
import { SessionService } from "../services/session_service";
import routeFailed from "./route_failed";
import errorHandle from "./error_handle";
import * as KoaStatic from 'koa-static';
import * as Path from 'path';

export default function middleware(context: Koa) {
    const ctrlRouter = new WebApiRouter();
    return Compose(
        [
            errorHandle(),
            KoaStatic(Path.join(__dirname, '../')),
            Session({
                cookie: {
                    maxAge: SessionService.maxAge
                }
            }),
            sessionHandle(),
            Bodyparser(),
            ctrlRouter.router('../build/controllers', 'api'),
            routeFailed(),
        ]
    );
}