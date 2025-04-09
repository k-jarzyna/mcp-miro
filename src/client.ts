import { MiroLowlevelApi } from "@mirohq/miro-api";

export class MiroClient {
  private static instance: MiroClient;
  private api: MiroLowlevelApi;
  
  private constructor() {
    const accessToken = process.env.MIRO_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('MIRO_ACCESS_TOKEN environment variable is required');
    }
    
    this.api = new MiroLowlevelApi(accessToken);
  }

  public static getApi(): MiroLowlevelApi {
    if (!MiroClient.instance) {
      MiroClient.instance = new MiroClient();
    }
    
    return MiroClient.instance.api;
  }
}

export default MiroClient;
