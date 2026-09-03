using System.Collections.Generic;
using System;
using System.Threading;
using UnityEngine.Profiling;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyHilogDispatcher
    {
        private class IntegrationTask
        {
            internal IOpenHarmonyHilogTaskResult result;
            internal Action<IOpenHarmonyHilogTaskResult> integrateAction;
        }

        private class AsyncTask
        {
            internal IOpenHarmonyHilogTaskInput taskData;
            internal Func<IOpenHarmonyHilogTaskInput, IOpenHarmonyHilogTaskResult> asyncAction;
            internal Action<IOpenHarmonyHilogTaskResult> integrateAction;
        }

        CustomSampler m_Sampler;

        private Queue<AsyncTask> m_AsyncTaskQueue = new Queue<AsyncTask>();
        private Queue<IntegrationTask> m_IntegrateTaskQueue = new Queue<IntegrationTask>();
        private AutoResetEvent m_AutoResetEvent = new AutoResetEvent(false);
        private AutoResetEvent m_FinishedEvent = new AutoResetEvent(false);
        private volatile bool m_Running;
        private static Thread s_MainThread;
        private OpenHarmonyHilogRuntimeBase m_Runtime;
        private int m_AsyncOperationsExecuted;

        internal OpenHarmonyHilogDispatcher(OpenHarmonyHilogRuntimeBase runtime)
        {
            m_Runtime = runtime;
            m_AsyncOperationsExecuted = 0;
        }

        internal void Initialize()
        {
            if (m_Running)
                throw new Exception("Already running?");
            m_Running = true;

            lock (m_AsyncTaskQueue)
                m_AsyncTaskQueue.Clear();

            lock (m_IntegrateTaskQueue)
                m_IntegrateTaskQueue.Clear();

            m_Runtime.Update += IntegrateMainThread;
            ThreadPool.QueueUserWorkItem(WorkerThread);

            m_Sampler = CustomSampler.Create("OpenHarmonyHilog Async Work");

            s_MainThread = Thread.CurrentThread;
        }

        internal void Shutdown()
        {
            if (!m_Running)
                throw new Exception("Expected dispatcher to run");
            m_Runtime.Update -= IntegrateMainThread;
            m_Running = false;
            m_AutoResetEvent.Set();
            if (!m_FinishedEvent.WaitOne(5000))
                throw new Exception("Time out while waiting for openharmony hilog dispatcher to exit.");

            lock (m_AsyncTaskQueue)
                m_AsyncTaskQueue.Clear();

            lock (m_IntegrateTaskQueue)
                m_IntegrateTaskQueue.Clear();

            OpenHarmonyHilogInternalLog.Log("Dispatcher shutting down");
        }

        internal static bool isMainThread
        {
            get
            {
                return Thread.CurrentThread == s_MainThread;
            }
        }

        /// <summary>
        /// Worker thread for async operations.
        /// Note: If there's an exception, very bad things happen which don't get reported anywhere, this is why we're try/catching async operation invoke
        /// </summary>
        /// <param name="o"></param>
        private void WorkerThread(object o)
        {
            OpenHarmonyHilogInternalLog.Log("Worker thread started");
            Profiler.BeginThreadProfiling("OpenHarmonyHilog", "Dispatcher");

            while (m_Running && m_AutoResetEvent.WaitOne())
            {
                bool remainingOperations = true;
                while (m_Running && remainingOperations)
                {
                    AsyncTask task = null;
                    lock (m_AsyncTaskQueue)
                    {
                        if (m_AsyncTaskQueue.Count > 0)
                        {
                            task = m_AsyncTaskQueue.Dequeue();
                        }

                        remainingOperations = m_AsyncTaskQueue.Count > 0;
                    }
                    if (task != null && task.asyncAction != null)
                    {
                        m_AsyncOperationsExecuted++;

                        try
                        {
                            m_Sampler.Begin();
                            var result = task.asyncAction.Invoke(task.taskData);
                            m_Sampler.End();

                            if (task.integrateAction != null)
                            {
                                lock (m_IntegrateTaskQueue)
                                {
                                    m_IntegrateTaskQueue.Enqueue(new IntegrationTask() { integrateAction = task.integrateAction, result = result });
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            OpenHarmonyHilogInternalLog.Log($"\nERROR while invoking async operation (Running={m_Running}: \n{ex.GetType().FullName}\n{ex.Message}");
                            if (ex is ThreadAbortException)
                            {
                                FinalizeWorkerThread();
                                throw;
                            }
                        }
                    }
                }
            }
            FinalizeWorkerThread();
        }

        private void FinalizeWorkerThread()
        {
            OpenHarmonyHilogInternalLog.Log("Worker thread exited");
            Profiler.EndThreadProfiling();
            m_FinishedEvent.Set();
        }

        private void IntegrateMainThread()
        {
            Queue<IntegrationTask> temp;

            lock (m_IntegrateTaskQueue)
            {
                temp = new Queue<IntegrationTask>(m_IntegrateTaskQueue);
                m_IntegrateTaskQueue.Clear();
            }

            foreach (var t in temp)
            {
                //Debug.Log("Integrating");
                t.integrateAction.Invoke(t.result);
            }
        }

        internal void Schedule(IOpenHarmonyHilogTaskInput taskData, Func<IOpenHarmonyHilogTaskInput, IOpenHarmonyHilogTaskResult> asyncAction, 
            Action<IOpenHarmonyHilogTaskResult> integrateAction, bool synchronous, IOpenHarmonyHilogDevice device = null)
        {
            if (!m_Running)
            {
                OpenHarmonyHilogInternalLog.Log("Ignore schedule action, because dispatcher is not running.");
                return;
            }

            if (synchronous)
            {
                m_AsyncOperationsExecuted++;

                try
                {
                    var result = asyncAction.Invoke(taskData);
                    if (result is OpenHarmonyHilogRetrieveDeviceIdsResult result1)
                        result1.m_SelectedDevice = device;
                    integrateAction(result);
                }
                catch (Exception ex)
                {
                    OpenHarmonyHilogInternalLog.Log("\nERROR while invoking async operation: \n" + ex.Message);
                }
                return;
            }

            lock (m_AsyncTaskQueue)
            {
                var task = new AsyncTask() { taskData = taskData, asyncAction = asyncAction, integrateAction = integrateAction };
                m_AsyncTaskQueue.Enqueue(task);
                if (!m_AutoResetEvent.Set())
                    throw new Exception("Failed to signal auto reset event in dispatcher.");
            }
        }

        internal void Schedule(IOpenHarmonyHilogTaskInput taskData, Func<IOpenHarmonyHilogTaskInput, IOpenHarmonyHilogTaskResult> asyncAction, bool synchronous)
        {
            Schedule(taskData, asyncAction, null, synchronous);
        }

        internal int AsyncOperationsInQueue
        {
            get
            {
                lock (m_AsyncTaskQueue)
                {
                    return m_AsyncTaskQueue.Count;
                }
            }
        }
        internal int AsyncOperationsExecuted
        {
            get
            {
                return m_AsyncOperationsExecuted;
            }
        }
    }
}
