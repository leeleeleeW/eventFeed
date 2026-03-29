
**1**  
Server-Sent Events (SSE), WebSockets, and polling are all distinct methods for real-time web communication, each with a different mechanism and use case. The terms do not refer to the same thing. 

Comparison of Methods


| Feature | Polling | Server-Sent Events (SSE) | WebSockets |
|:---|:---:|---:|---:|
| **Communication** | Unidirectional (client asks, server answers immediately) | Unidirectional (server pushes to client over an open HTTP connection)	 |Bidirectional (full-duplex, either can send anytime) |
| **Protocol**| Standard HTTP/HTTPS requests | Standard HTTP via text/event-stream content type |A separate, persistent ws:// or wss:// protocol |
|**Connection Model**|New connection for each request and response|Single, long-lived HTTP connection|A persistent, upgraded connection over a single TCP socket|
|**Overhead**|High, due to repeated HTTP handshakes for every request	|Moderate;keeps one connection open, less overhead than polling|Very low per-message overhead after initial handshake|
|**Automatic Reconnection**|Must be manually implemented on the client side	|Built-in automatic reconnection in the browser's EventSource API|Must be manually implemented on the client side|
|**Primary Use Cases**|Infrequent updates, simple systems, legacy compatibility|Live feeds, notifications, stock tickers, AI output streaming|Chat applications, multiplayer games, collaborative tools, trading platforms|


**Summary**

**Polling** is the simplest but least efficient method, involving the client repeatedly making new HTTP requests at fixed intervals to check for updates.

**Server-Sent Events (SSE)** are more efficient for server-to-client updates, as they open a single, long-lived HTTP connection that the server uses to stream data. It is unidirectional.

**WebSockets** provide a persistent, two-way communication channel with minimal latency, making them ideal for truly interactive applications where both client and server need to send messages freely. 

**I would choose Server-Sent Events (SSE) bacause SSE is simple and effecient, best mathces live event feed application's communication patterns and requirements.**


**2**

The maximum number of events strored would be much larger in accordance with database size and business need.
And I would create a table for storage of events evicted due to lower priority.


**3**

For example, Tomcat 8 (web server to give an example) and above that uses the NIO connector for handling incoming requst. It can service max 10,000 concurrent connections(docs). It does not say anything about max connections pers se. They also provide another parameter called acceptCount which is the fall back if connections exceed 10,000.

It is not clear what is max limit that is allowed. Some say default for tomcat is 1096 but the (default) one for linux is 30,000 which can be changed.

**4**

The frontend could be enhanced to add more functions, for instance, to show the current connected clients.





