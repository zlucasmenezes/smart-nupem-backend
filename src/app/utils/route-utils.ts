
export class RouteUtils {

  public static getDeviceType(params: { [key: string]: string }): string {
    const types: { [key: string]: string } =
    {
      sensorId: 'sensor',
      relayId: 'relay'
    };

    for (const type of Object.keys(types)) {
      if (type in params) {
        return types[type];
      }
    }

    return '';
  }
}
