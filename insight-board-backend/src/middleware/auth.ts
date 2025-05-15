import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAUth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decode;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};
