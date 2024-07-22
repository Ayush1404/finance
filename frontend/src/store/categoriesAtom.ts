import { atom } from "recoil"
import { Category } from "../components/tables/categories/columns";

const categoriesAtom = atom<Category[]>({
    key:'Categories',
    default:[]
})

export default categoriesAtom;
