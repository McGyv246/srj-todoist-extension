import { createHash } from "crypto";

export const hash = (text: string) => {
    return createHash("sha256").update(text).digest("hex");
};
