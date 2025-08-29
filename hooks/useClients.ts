import { useQuery } from '@tanstack/react-query';
import { clientServices } from "@/services/clientServices"
import { ClientsCacheKeys } from "@/lib/const"

export const useClients = () => {
  const getClients = useQuery({
    queryKey: [ClientsCacheKeys.Clients],
    queryFn: () => clientServices.getAll()
  })

  return {
    getClients
  }
}

export const useClient = (clientId?: number) => {
  const getClient = useQuery({
    queryKey: [ClientsCacheKeys.Clients, clientId],
    queryFn: () => clientServices.getById(clientId as number),
    enabled: !!clientId
  })

  return {
    getClient
  }
}

export const useClientsByEntreprise = (entrepriseId?: number) => {
  const getClientsByEntreprise = useQuery({
    queryKey: [ClientsCacheKeys.ClientsByEntreprise, entrepriseId],
    queryFn: () => clientServices.getByEntreprise(entrepriseId as number),
    enabled: !!entrepriseId
  })

  return {
    getClientsByEntreprise
  }
}
