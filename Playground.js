class Doc {
  constructor(props) {
    this.hash = props?.hash
    this.filename = props?.filename
    this.mime_type = props?.mime_type
    this.document_type = props?.document_type
    this.identity_type = props?.identity_type
    this.description = props?.description
  }

  isValid = () => !Object.keys(this).some(key => this[key] === undefined && key !== "description")
}

let documents = [];

const onDrop = (newDocs) => {
  documents = [...documents, ...newDocs.map(file => new Doc(file))]
}

const documentBeingDropped = {
  hash: "my hash",
  filename: "my file",
  mime_type: "application",
  document_type: "png",
  identity_type: "other"
}

const anotherDocumentBeingDropped = {
  hash: "my hash",
  filename: "my file",
  mime_type: "application",
  document_type: "png",
  identity_type: "other"
}

const newDroppedDocs = [documentBeingDropped, anotherDocumentBeingDropped];

onDrop(newDroppedDocs);

const validateDocs = () => {
  if (documents.find(doc => !doc.isValid())) {
    console.warn("There is an invalid document");
    return;
  }
  console.log("All documetns are valid");
}

validateDocs();

let arr = '[[]]'

typeof arr === 'string'