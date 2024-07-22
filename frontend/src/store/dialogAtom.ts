import { atom, selector } from "recoil";

interface ConfrimationDialogState {
    isOpen:boolean,
    title:string,
    message:string
    primaryAction:()=>void
}

interface DialogState {
    ConfrimationDialog:ConfrimationDialogState
}

const dialogAtom = atom<DialogState>({
    key: 'Dialogs',
    default: {
        ConfrimationDialog: {
            isOpen:false,
            title:"",
            primaryAction:()=>{},
            message:""
        },
    },
});

export const confrimationDialog = selector<ConfrimationDialogState>({
    key: 'ConfrimationDialog',
    get: ({ get }) => {
        const dialogs = get(dialogAtom);
        return dialogs.ConfrimationDialog;
    },
    set: ({ set, get }, newValue) => {
        const dialogs = get(dialogAtom);
        set(dialogAtom, {
            ...dialogs,
            ConfrimationDialog: newValue as ConfrimationDialogState,
        });
    },
});
