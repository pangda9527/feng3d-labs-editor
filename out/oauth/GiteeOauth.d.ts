export declare var giteeOauth: GiteeOauth;
/**
 * gitee 认证授权
 */
export declare class GiteeOauth {
    /**
     * 认证授权
     *
     * @param callback 完成回调
     */
    oauth(callback?: () => void): void;
    getAccessToken(): void;
    getUser(): void;
}
//# sourceMappingURL=GiteeOauth.d.ts.map