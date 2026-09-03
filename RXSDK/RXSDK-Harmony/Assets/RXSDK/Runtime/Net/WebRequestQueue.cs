using System.Collections.Concurrent;
using System.Collections;
using UnityEngine;
using System;
using System.Threading;

namespace RXSDK.Net
{
    class WebRequestQueue
    {
        private readonly ConcurrentQueue<RXWebRequest> rxRequestQueue = new();
        private readonly ConcurrentDictionary<string, int> retryCount = new();
        private bool isProcessing = false;
        private readonly int maxRetries = 3;
        private readonly float retryDelay = 1f; // Delay in seconds between retries
        private MonoBehaviour monoBehaviour;

        public int QueueCount => rxRequestQueue.Count;
        public bool IsProcessing => isProcessing;

        public WebRequestQueue(MonoBehaviour mono)
        {
            monoBehaviour = mono ?? throw new ArgumentNullException(nameof(mono));
        }

        public WebRequestQueue AddRequest(RXWebRequest req)
        {
            if (req == null)
                throw new ArgumentNullException(nameof(req));

            rxRequestQueue.Enqueue(req);

            // Start processing if not already running
            if (!isProcessing)
            {
                StartProcessing();
            }

            return this;
        }

        private void StartProcessing()
        {
            if (monoBehaviour != null && !isProcessing)
            {
                isProcessing = true;
                monoBehaviour.StartCoroutine(ProcessRequestsCoroutine());
            }
        }

        private IEnumerator ProcessRequestsCoroutine()
        {
            while (rxRequestQueue.Count > 0)
            {
                if (rxRequestQueue.TryDequeue(out RXWebRequest request))
                {
                    yield return ProcessSingleRequest(request);
                }
            }

            isProcessing = false;
        }

        private IEnumerator ProcessSingleRequest(RXWebRequest request)
        {
            string requestId = request.Url;
            int currentRetry = 0;

            while (currentRetry <= maxRetries)
            {
                bool success = false;
                Exception error = null;
                bool requestComplete = false;

                try
                {
                    // Process the request using RXWebRequest's async methods
                    request.RequestAsync<object>(
                        monoBehaviour,
                        (result, ex) =>
                        {
                            success = (result?.code == 0);
                            error = ex;
                            requestComplete = true;
                        }
                    );
                }
                catch (Exception ex)
                {
                    error = ex;
                    Log.Exception(ex);
                }

                // Wait for the request to complete outside try-catch
                while (!requestComplete)
                {
                    yield return null;
                }

                if (success)
                {
                    // Request succeeded, remove from retry tracking if present
                    retryCount.TryRemove(requestId, out _);
                    break;
                }

                // If we reach here, the request failed
                currentRetry++;

                if (currentRetry <= maxRetries)
                {
                    // Update retry count
                    retryCount.AddOrUpdate(requestId, 1, (_, count) => count + 1);

                    // Wait before retrying
                    yield return new WaitForSeconds(retryDelay * currentRetry);
                }
                else
                {
                    Log.D($"Request failed after {maxRetries} retries: {requestId}");
                    // Could implement a failure callback here if needed
                }
            }
        }

        public void ClearQueue()
        {
            while (rxRequestQueue.TryDequeue(out _)) { }
            retryCount.Clear();
        }

        public bool HasPendingRequests()
        {
            return rxRequestQueue.Count > 0 || isProcessing;
        }
    }
}