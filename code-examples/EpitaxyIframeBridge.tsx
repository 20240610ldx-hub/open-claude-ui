/**
 * 维度三：工件预览沙箱与隔离通信架构 (Epitaxy)
 * 逆向还原自 Claude Desktop: c58115fda-BKnbLmi3.js / cd5a31703-B4nKQMBN.js
 * 
 * 核心特性：
 * 1. 5 重权限沙箱隔离与 strict-origin
 * 2. 用户手势激活门禁拦截 (hasUserActivation 校验)
 * 3. 7 种 ant 专有 MIME 协议分流
 * 4. 虚拟包别名重定向与自愈解析
 */

import React, { useRef, useEffect, useCallback } from 'react';

export type EpitaxyMimeType =
  | 'application/vnd.ant.react'
  | 'application/vnd.ant.code'
  | 'application/vnd.ant.markdown'
  | 'application/vnd.ant.mermaid'
  | 'application/vnd.ant.svg'
  | 'application/vnd.ant.html'
  | 'application/vnd.ant.latex';

interface EpitaxyIframeBridgeProps {
  srcDoc: string;
  mimeType?: EpitaxyMimeType;
  onMessage?: (payload: any) => void;
  onError?: (err: any) => void;
  onRecovered?: (moduleName: string) => void;
}

export const EpitaxyIframeBridge: React.FC<EpitaxyIframeBridgeProps> = ({
  srcDoc,
  onMessage,
  onError,
  onRecovered
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // 核心安全校验 1：确保消息确实来自受管辖的当前 iframe Window
      if (event.source !== iframeRef.current?.contentWindow) return;
      const { channel, type, payload, hasUserActivation, recoveredModule } = event.data || {};

      // 核心安全校验 2：严格门禁，拦截未带真实用户交互标记的恶意合成消息
      if (channel === 'epitaxy_mcp_app') {
        if (!event.isTrusted || !hasUserActivation) {
          console.warn('[Epitaxy MCP App] Blocked synthetic message without iframe-originated user activation');
          return;
        }
        onMessage?.(payload);
      } else if (type === 'EPITAXY_RUNTIME_ERROR') {
        onError?.(payload);
      } else if (type === 'EPITAXY_MODULE_RECOVERED') {
        onRecovered?.(recoveredModule);
      }
    },
    [onMessage, onError, onRecovered]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  return (
    <iframe
      ref={iframeRef}
      title="Claude Epitaxy Artifact Sandbox"
      srcDoc={srcDoc}
      // 官方 5 重权限安全沙箱配置
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      referrerPolicy="strict-origin"
      allow="clipboard-write; fullscreen"
      className="h-full w-full border-0 bg-transparent"
    />
  );
};
