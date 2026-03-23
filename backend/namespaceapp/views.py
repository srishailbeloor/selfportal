import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from kubernetes import client, config
from .models import NamespaceRecord


def home(request):
    return JsonResponse({"message": "Backend running"})

# def list_namespaces(request):
#     records = NamespaceRecord.objects.all().values()
#     return JsonResponse(list(records), safe=False)

def list_k8s_namespaces(request):
    config.load_kube_config()
    v1 = client.CoreV1Api()

    ns_list = v1.list_namespace()

    result = []
    for ns in ns_list.items:
        result.append({
            "namespace": ns.metadata.name,
            "status": ns.status.phase
        })

    return JsonResponse(result, safe=False)

@csrf_exempt
def create_namespace(request):

    if request.method == 'OPTIONS':
        return JsonResponse({"message": "OK"})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            namespace = data.get('namespace')
            owner = data.get('owner')
            cpu = data.get('cpu_quota')
            memory = data.get('memory_quota')

            
            print("Creating namespace:", namespace) 
            print("Kubernetes call starting")

            
            config.load_kube_config()
            v1 = client.CoreV1Api()

            ns = client.V1Namespace(
                metadata=client.V1ObjectMeta(
                    name=namespace,
                    labels={"owner": owner}
                )
            )

            v1.create_namespace(ns)

            quota = client.V1ResourceQuota( 
                metadata=client.V1ObjectMeta( 
                    name="resource-quota", 
                    namespace=namespace 
                    ), 
                    spec=client.V1ResourceQuotaSpec( 
                        hard={ 
                            "limits.cpu": cpu, 
                            "limits.memory": memory 
                            } 
                        ) 
                    ) 
            v1.create_namespaced_resource_quota(namespace, quota) 
            print("Resource quota applied:", cpu, memory)

            # save to db if kuber success
            NamespaceRecord.objects.create(
                namespace=namespace,
                owner=owner,
                cpu_quota=cpu,
                memory_quota=memory,
                status="Active"
            )

            return JsonResponse({"message": "Namespace created successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)})

    return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def delete_namespace(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            namespace = data.get('namespace')

            print("Deleting namespace:", namespace)

            # Kubernetes delete
            config.load_kube_config()
            v1 = client.CoreV1Api()

            v1.delete_namespace(name=namespace)

            # Update DB
            NamespaceRecord.objects.filter(namespace=namespace).update(status="Deleted")

            return JsonResponse({"message": "Namespace deleted successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)})

    return JsonResponse({"message": "Invalid request"})





