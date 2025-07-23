"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/top-bar";
import SessionConfigurationPanel from "@/components/session-configuration-panel";
import Transcript from "@/components/transcript";
import FunctionCallsPanel from "@/components/function-calls-panel";
import { Item } from "@/components/types";
import handleRealtimeEvent from "@/lib/handle-realtime-event";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CallInterface = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [callStatus, setCallStatus] = useState("disconnected");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Connect to websocket server (will use environment variable for URL in production)
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/logs`
      : "ws://localhost:8081/logs";
    
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log("Connected to logs websocket");
      setCallStatus("connected");
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received logs event:", data);
      handleRealtimeEvent(data, setItems);
    };

    newWs.onclose = () => {
      console.log("Logs websocket disconnected");
      setWs(null);
      setCallStatus("disconnected");
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
      setCallStatus("error");
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col">
      <TopBar />
      <div className="flex-grow p-4 h-full overflow-hidden flex flex-col">
        {/* Status Bar */}
        <Card className="flex items-center justify-between p-4 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Connection Status:</span>
            <Badge variant={callStatus === "connected" ? "default" : "secondary"}>
              {callStatus === "connected" ? "Connected" : callStatus === "error" ? "Error" : "Disconnected"}
            </Badge>
          </div>
        </Card>

        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Column */}
          <div className="col-span-3 flex flex-col h-full overflow-hidden">
            <SessionConfigurationPanel
              callStatus={callStatus}
              onSave={(config) => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                  const updateEvent = {
                    type: "session.update",
                    session: {
                      ...config,
                    },
                  };
                  console.log("Sending update event:", updateEvent);
                  ws.send(JSON.stringify(updateEvent));
                }
              }}
            />
          </div>

          {/* Middle Column: Transcript */}
          <div className="col-span-6 flex flex-col gap-4 h-full overflow-hidden">
            <Transcript items={items} />
          </div>

          {/* Right Column: Function Calls */}
          <div className="col-span-3 flex flex-col h-full overflow-hidden">
            <FunctionCallsPanel items={items} ws={ws} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
