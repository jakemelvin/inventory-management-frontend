import { useQuery } from '@tanstack/react-query';
import { clientServices } from "@/services/clientServices"
import { ClientsCacheKeys } from "@/lib/const"

export const useClients = (entrepriseId?: number) => {
  const getClients = useQuery({
    queryKey: [ClientsCacheKeys.Clients, entrepriseId],
    queryFn: () => clientServices.getAll(entrepriseId),
    enabled: !!entrepriseId
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
