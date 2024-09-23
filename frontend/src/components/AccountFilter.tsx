import { useRecoilValue } from "recoil"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import accountsAtom from "../store/accountsAtom"
import qs from 'query-string'
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const AccountFilter = () => {
    const [params] = useSearchParams()
    const pathname = useLocation().pathname
    const accountId = params.get('accountId') || 'all'
    const accounts = useRecoilValue(accountsAtom)
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const navigate = useNavigate()
    
    const onChange = (newValue:string) => {
        const query = {
            from,
            to,
            accountId:newValue
        }

        if(newValue ==='all'){
            query.accountId=''
        }

        const url = qs.stringifyUrl({
            url:pathname,
            query
        },{ skipNull: false , skipEmptyString : true})

        navigate(url)
    }

    const getAccountName = (id: string) => {
        if (id === 'all') return 'All accounts'
        const account = accounts.find(acc => Number(acc.id) === Number(id))
        return account ? account.name : 'Select account'
    }

    return (
        <Select
            value={accountId}
            onValueChange={onChange}
            disabled={false}
        >
            <SelectTrigger 
                className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 mt-2 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
            >
                <SelectValue placeholder='Select account'>{getAccountName(accountId)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All accounts
                </SelectItem>
                {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default AccountFilter