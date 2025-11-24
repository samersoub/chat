export class PermissionManager {
  static async ensureMicPermission(): Promise<boolean> {
    if (!("permissions" in navigator)) {
      // Fallback: try requesting directly
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
      } catch {
        return false;
      }
    }
    try {
      // @ts-expect-error chrome types mismatch
      const status: PermissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName });
      if (status.state === "granted") return true;
      if (status.state === "prompt") {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
      }
      return false;
    } catch {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
      } catch {
        return false;
      }
    }
  }
}