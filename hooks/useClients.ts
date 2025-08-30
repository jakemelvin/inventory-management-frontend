import { useMutation, useQuery } from '@tanstack/react-query';
import { clientServices } from "@/services/clientServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { Client, CreateClientRequest, UpdateClientRequest, ApiError } from '@/types';
import { ClientsCacheKeys, ClientMutationKeys } from "@/lib/const"

export const useClient = ({ clientId }: {
    clientId?: Client['id']
}) => {
    const createClient = useMutation({
        mutationKey: [ClientMutationKeys.Create],
        mutationFn: ({ data }: { data: CreateClientRequest }) =>
            clientServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ClientsCacheKeys.Clients]
            })
            toast.success("Succès", {
                description: "Client créé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer le client",
            })
        }
    })

    const updateClient = useMutation({
        mutationKey: [ClientMutationKeys.Update],
        mutationFn: ({ id, data }: { id: Client['id'], data: UpdateClientRequest }) =>
            clientServices.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ClientsCacheKeys.Clients]
            })
            toast.success("Succès", {
                description: "Client mis à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour le client",
            })
        }
    })

    const getClient = useQuery({
        queryKey: [ClientsCacheKeys.Clients, clientId],
        queryFn: () =>
            clientServices.getById(clientId as Client['id']),
        enabled: !!clientId
    })

    const deleteClient = useMutation({
        mutationKey: [ClientMutationKeys.Delete],
        mutationFn: (clientId: Client['id']) => clientServices.delete(clientId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ClientsCacheKeys.Clients]
            })
            toast.success("Succès", {
                description: "Client supprimé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer le client",
            })
        }
    })

    return {
        createClient,
        updateClient,
        getClient,
        deleteClient
    }
}

export const useClients = () => {
    const getClients = useQuery({
        queryKey: [ClientsCacheKeys.Clients],
        queryFn: () => clientServices.getAll()
    })

    return {
        getClients
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
