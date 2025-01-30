declare namespace Express {
  interface Request {
    user: {
      id: string;
      name: string;
      email: string;
      isMaster: boolean;
      profileTags: string[];
    };
  }
}
