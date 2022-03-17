export interface PlatformLoginHandler {
    getLoginData(): Promise<{[key: string]: any}>
}
