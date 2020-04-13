const {ApolloServer, gql} = require('apollo-server');
const {randomFillSync} = require('crypto');

const TransactionUtils = {

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

};

const InMemoryStore = {

    bankTransactions: [
        {
            id: TransactionUtils.uuidv4(),
            date: "2010-10-10",
            refNumber: "IK-001",
            description: "Inter IKEA Group",
            amount: -100.00
        },
        {
            id: TransactionUtils.uuidv4(),
            date: "2010-10-09",
            refNumber: "ACME-01",
            description: "Payment by ACME",
            amount: 200.00
        },
        {
            id: TransactionUtils.uuidv4(),
            date: "2011-10-09",
            refNumber: "PEP-01",
            description: "Venta Pepito",
            amount: 300.00
        },
        {
            id: TransactionUtils.uuidv4(),
            date: "2010-10-10",
            refNumber: "ACME-01",
            description: "Payment by ACME",
            amount: 650.00
        },
        {
            id: TransactionUtils.uuidv4(),
            date: "2010-10-11",
            refNumber: "ACME-01",
            description: "Payment by ACME",
            amount: 50.00
        },
    ],

    invoices: [
        {
            id: TransactionUtils.uuidv4(),
            date: "2010-10-09",
            refNumber: "ACME-01",
            client: "Sale ACME",
            amount: 900.00,
        }

    ]
};

const typeDefs = gql`
    type Query { 
        bankTransactions: [BankTransaction]
        invoices: [Invoice]
    }
    
    type Mutation {
        addBankTransaction(bankTransaction: AddBankTransactionInput!): BankTransaction
        editBankTransaction(bankTransaction: EditBankTransactionInput!): BankTransaction
        addInvoice(invoice: AddInvoiceInput!): Invoice
        editInvoice(invoice: EditInvoiceInput!): Invoice
    }
    
    input AddBankTransactionInput {
        date: String, 
        refNumber: String, 
        description: String, 
        amount: Int
    }
    
    input EditBankTransactionInput {
        id: ID!,
        date: String, 
        refNumber: String, 
        description: String, 
        amount: Int
    }
    
    input AddInvoiceInput {
        date: String,
        refNumber: String,
        client: String,
        amount: Int 
    }
    
    input EditInvoiceInput {
        id: ID!,
        date: String,
        refNumber: String,
        client: String,
        amount: Int 
    }
    
    type BankTransaction { 
        id: ID!, 
        date: String, 
        refNumber: String, 
        description: String, 
        amount: Int 
    }
    
    type Invoice {
        id: ID!,
        date: String,
        refNumber: String,
        client: String,
        amount: Int 
    }
`;

const resolvers = {
    Query: {
        bankTransactions: () => InMemoryStore.bankTransactions,
        invoices: () => InMemoryStore.invoices
    },
    Mutation: {
        addBankTransaction: (_, {bankTransaction}) => {
            const instance = {...bankTransaction};
            instance.id = TransactionUtils.uuidv4();
            console.log("\nSaving bank transaction");
            console.log(instance);
            InMemoryStore.bankTransactions.push(instance);
            return instance
        },
        editBankTransaction: (_, {bankTransaction}) => {
            const oldInstance = InMemoryStore.bankTransactions.find(item => item.id === bankTransaction.id);
            console.log("\nEditing bank transaction (patch enabled)");
            console.log(bankTransaction);
            Object.assign(oldInstance, bankTransaction);
            console.log(oldInstance);
            return oldInstance
        },
        addInvoice: (_, {invoice}) => {
            const instance = {...invoice};
            instance.id = TransactionUtils.uuidv4();
            console.log("\nSaving invoice");
            console.log(instance);
            InMemoryStore.invoices.push(instance);
            return instance
        },
        editInvoice: (_, {invoice}) => {
            const oldInstance = InMemoryStore.invoices.find(item => item.id === invoice.id);
            console.log("\nEditing invoice (patch enabled)");
            console.log(invoice);
            Object.assign(oldInstance, invoice);
            console.log(oldInstance);
            return oldInstance;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
});

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
});
