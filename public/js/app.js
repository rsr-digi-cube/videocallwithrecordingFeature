window.addEventListener('load', () => {
    // Put all client-side code here
    const chatTemplate = Handlebars.compile($('#chat-template').html());
    const chatContentTemplate = Handlebars.compile($('#chat-content-template').html());
    const chatEl = $('#chat');
    const formEl = $('.form');
    const messages = [];
    let username;
    const localImageEl = $('#local-image');
    const localVideoEl = $('#local-video');
    const remoteVideoTemplate = Handlebars.compile($('#remote-video-template').html());
    const remoteVideosEl = $('#remote-videos');
    let remoteVideosCount = 0;
    localVideoEl.hide();
    formEl.form({
        fields: {
        roomName: 'empty',
        username: 'empty',
        },
    });

    const webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'local-video',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remote-videos',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: false,
      });
      webrtc.on('localStream', () => {
        localImageEl.hide();
        localVideoEl.show();
      });
      webrtc.on('videoAdded', (video, peer) => {
        // eslint-disable-next-line no-console
        const id = webrtc.getDomId(peer);
        const html = remoteVideoTemplate({ id });
        if (remoteVideosCount === 0) {
          remoteVideosEl.html(html);
        } else {
          remoteVideosEl.append(html);
        }
        $(`#${id}`).html(video);
        $(`#${id} video`).addClass('ui image medium'); // Make video element responsive
        remoteVideosCount += 1;
      });
      const updateChatMessages = () => {
        const html = chatContentTemplate({ messages });
        const chatContentEl = $('#chat-content');
        chatContentEl.html(html);
        // automatically scroll downwards
        const scrollHeight = chatContentEl.prop('scrollHeight');
        chatContentEl.animate({ scrollTop: scrollHeight }, 'slow');
      };
      const postMessage = (message) => {
        const chatMessage = {
          username,
          message,
          postedOn: new Date().toLocaleString('en-GB'),
        };
        // Send to all peers
        webrtc.sendToAll('chat', chatMessage);
        // Update messages locally
        messages.push(chatMessage);
        $('#post-message').val('');
        updateChatMessages();
      };
      const showChatRoom = (room) => {
        formEl.hide();
        const html = chatTemplate({ room });
        chatEl.html(html);
        const postForm = $('form');
        postForm.form({
          message: 'empty',
        });
        $('#post-btn').on('click', () => {
          const message = $('#post-message').val();
          postMessage(message);
        });
        $('#post-message').on('keyup', (event) => {
          if (event.keyCode === 13) {
            const message = $('#post-message').val();
            postMessage(message);
          }
        });
      };
      const createRoom = (roomName) => {
        // eslint-disable-next-line no-console
        console.info(`Creating new room: ${roomName}`);
        webrtc.createRoom(roomName, (err, name) => {
          formEl.form('clear');
          showChatRoom(name);
          postMessage(`${username} created chatroom`);
        });
      };
      const joinRoom = (roomName) => {
        // eslint-disable-next-line no-console
        console.log(`Joining Room: ${roomName}`);
        webrtc.joinRoom(roomName);
        showChatRoom(roomName);
        postMessage(`${username} joined chatroom`);
      };
      webrtc.connection.on('message', (data) => {
        if (data.type === 'chat') {
          const message = data.payload;
          messages.push(message);
          updateChatMessages();
        }
      });

      $('.submit').on('click', (event) => {
        if (!formEl.form('is valid')) {
          return false;
        }
        username = $('#username').val();
        const roomName = $('#roomName').val().toLowerCase();
        if (event.target.id === 'create-btn') {
          createRoom(roomName);
        } else {
          joinRoom(roomName);
        }
        return false;
      });
  });