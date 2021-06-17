import { Request, Response } from "express";

class HealthController {
  // health check status 200
  public health(req: Request, res: Response) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.status(200).json({ status: 200, message: "OK" });
  }
}

export const healthController = new HealthController();
