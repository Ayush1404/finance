import { atom, selector } from "recoil";

interface EditAccountSheetState {
    isOpen:boolean,
    id:string,
    values:{
        name:string
    }
}
interface EditCategorySheetState {
    isOpen:boolean,
    id:string,
    values:{
        name:string
    }
}
interface EditTransactionSheetState {
    isOpen:boolean,
    id:string,
    values:{
        id: string
        date:Date,
        payee:string,
        amount:string,
        accountId:string,
        categoryId:string,
        notes:string|null
    }
}


interface SheetsState {
    NewAccountSheet: boolean;
    EditAccountSheet : EditAccountSheetState;
    NewCategorySheet: boolean;
    EditCategorySheet : EditCategorySheetState
    NewTransactionSheet: boolean;
    EditTransactionSheet : EditTransactionSheetState
}

const sheetAtom = atom<SheetsState>({
    key: 'Sheets',
    default: {
        NewAccountSheet: false,
        EditAccountSheet :{
            isOpen:false,
            id:'',
            values:{
                name:''
            }
        },
        NewCategorySheet: false,
        EditCategorySheet :{
            isOpen:false,
            id:'',
            values:{
                name:''
            }
        },
        NewTransactionSheet: false,
        EditTransactionSheet :{
            isOpen:false,
            id:'',
            values:{
                id: '',
                date:new Date(),
                payee:'',
                amount:'',
                accountId:'',
                categoryId:'',
                notes:''
            }
        }
    },
});

export const newAccountSheet = selector<boolean>({
    key: 'NewAccountSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.NewAccountSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            NewAccountSheet: newValue as boolean,
        });
    },
});

export const editAccountSheet = selector<EditAccountSheetState>({
    key: 'EditAccountSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.EditAccountSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            EditAccountSheet: newValue as EditAccountSheetState,
        });
    },
});

export const newCategorySheet = selector<boolean>({
    key: 'NewCategorySheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.NewCategorySheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            NewCategorySheet: newValue as boolean,
        });
    },
});

export const editCategorySheet = selector<EditCategorySheetState>({
    key: 'EditCategorySheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.EditCategorySheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            EditCategorySheet: newValue as EditCategorySheetState,
        });
    },
});


export const newTransactionSheet = selector<boolean>({
    key: 'NewTransactionSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.NewTransactionSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            NewTransactionSheet: newValue as boolean,
        });
    },
});

export const editTransactionSheet = selector<EditTransactionSheetState>({
    key: 'EditTransactionSheet',
    get: ({ get }) => {
        const sheets = get(sheetAtom);
        return sheets.EditTransactionSheet;
    },
    set: ({ set, get }, newValue) => {
        const sheets = get(sheetAtom);
        set(sheetAtom, {
            ...sheets,
            EditTransactionSheet: newValue as EditTransactionSheetState,
        });
    },
});
