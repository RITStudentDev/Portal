function MessengerUI (){
    return (
        <>
          <h1>Messaging page</h1>
          <ol>
            <li>chat message example 1</li>
            <li>chat message example 2</li>
          </ol>
          <div className='c-input-container'>
            <ChatInput />
          </div>
          <button>Send</button>
        </>
      )
}

export default MessengerUI