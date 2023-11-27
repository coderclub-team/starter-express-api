declare global {
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
}

export interface IAppConfig {
  splashlogo: [
    {
      // image: "assets/images/splashscreen/splash_logo.gif";
      image: string;
    }
  ];
  applogo: [
    {
      // image: "assets/icons/milk_bottle.png";
      image: string;
    }
  ];
  walkthrogh: {
    // title: "Pick up";
    // description: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.";
    // image: "assets/images/walkthrough/pickup.png";
    title: string;
    description: string;
    image: string;
  }[];
}
