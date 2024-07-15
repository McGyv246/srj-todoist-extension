import "dotenv/config";
// @ts-ignore
import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { DoistCardRequest } from "@doist/ui-extensions-core";

import { tasksSetBridgeError } from "./utils/Bridges";
import { CustomError } from "./utils/CustomErrors";
import {
    cloneBuffer,
    getAppToken,
    isRequestValid,
} from "./service/RequestService";
import { ServerResponse } from "http";
import { ActionService } from "./service/ActionService";
import { IncomingMessageWithRawBody } from "./utils/Model";

const port = 3000;
const app = express();

const verificationToken = process.env.TODOIST_VERIFICATION_TOKEN;

app.use(
    json({
        verify: function rawBodyExtraction(
            req: IncomingMessageWithRawBody,
            _res: ServerResponse,
            buf: Buffer,
            _encoding: string
        ): boolean {
            if (
                Boolean(req.headers["x-todoist-hmac-sha256"]) &&
                Buffer.isBuffer(buf)
            ) {
                req.rawBody = cloneBuffer(buf);
            }
            return true;
        },
    })
);

const processPing = function (
    request: Request,
    response: Response,
    next: NextFunction
) {
    response.send("pong");
};

const processRequest = async function (
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        if (!verificationToken || !isRequestValid(request, verificationToken)) {
            throw new Error("Request verification failed");
        }

        const doistRequest: DoistCardRequest = request.body as DoistCardRequest;

        const responseAction = await ActionService.processRequest(
            doistRequest,
            getAppToken(request)
        );

        response.status(200).json(responseAction);
    } catch (e) {
        next(e);
        return;
    }
};

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.log(err);
    if (err instanceof CustomError) {
        errorResponse(res, err.statusCode);
    } else {
        errorResponse(res, 500);
    }
    return;
};

app.get("/ping", processPing);
app.post("/process", processRequest);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`UI Extension server running on port ${port}.`);
});

const errorResponse = (response: Response, statusCode: number) => {
    response.status(statusCode).json({ bridges: tasksSetBridgeError });
};
