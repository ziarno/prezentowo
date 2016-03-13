FormErrorMessage = ({schema}) => (
  <Message
    hidden={schema.isValid()}
    className="form-popup--error icon attached fluid error"
    icon="warning"
    messages={schema.invalidKeys().map((key) => (
      schema.keyErrorMessage(key.name)
    ))}
  />
);
