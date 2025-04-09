export class ServerResponse {
  content: { type: string, text: string }[];
  isError: boolean = false;

  public static text(text: string): any {
    return Object.assign(new ServerResponse(), {
      content: [
        {
          type: 'text',
          text
        }
      ]
    })
  }

  public static error(err: string): any {
    return Object.assign(new ServerResponse(), {
      content: [
        {
          type: 'text',
          text: typeof err === 'object' ? JSON.stringify(err) : err
        },
      ],
      isError: true
    })
  }
}