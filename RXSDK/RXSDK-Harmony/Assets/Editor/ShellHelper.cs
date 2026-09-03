using UnityEngine;
using System.Diagnostics;
using System.IO;
using Debug = UnityEngine.Debug;

public static class ShellHelper
{
    // ANSI color codes for logging
    private const string RED = "\u001B[0;31m";
    private const string GREEN = "\u001B[0;32m";
    private const string YELLOW = "\u001B[1;33m";
    private const string BLUE = "\u001B[0;34m";
    private const string NC = "\u001B[0m"; // No Color

    /// <summary>
    /// Executes a shell command and handles its output
    /// </summary>
    /// <param name="command">The command to execute</param>
    /// <param name="workingDirectory">Optional working directory</param>
    /// <returns>True if the command executed successfully</returns>
    public static bool RunShellCommand(string command, string workingDirectory = null)
    {
        try
        {
            // Validate input
            if (string.IsNullOrEmpty(command))
            {
                LogError("Command cannot be empty");
                return false;
            }

            // Use current directory if not specified
            workingDirectory ??= Directory.GetCurrentDirectory();

            // Log command details
            LogInfo($"Executing command in: {workingDirectory}");
            LogCommand(command);

            // Setup process
            var processInfo = new ProcessStartInfo
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"{command.Replace("\"", "\\\"")}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = workingDirectory
            };

            // Create and start process
            using var process = new Process { StartInfo = processInfo };

            // Handle output
            process.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    LogOutput(e.Data);
            };

            // Handle errors
            process.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    LogError(e.Data);
            };

            // Execute
            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
            process.WaitForExit();

            // Check result
            bool success = process.ExitCode == 0;
            if (success)
                LogSuccess("Command completed successfully");
            else
                LogError($"Command failed with exit code: {process.ExitCode}");

            return success;
        }
        catch (System.Exception ex)
        {
            LogError($"Failed to execute command: {ex.Message}");
            return false;
        }
    }

    // Colored logging methods
    private static void LogInfo(string message) => Debug.Log($"{BLUE}INFO:{NC} {message}");
    private static void LogError(string message) => Debug.LogError($"{RED}ERROR:{NC} {message}");
    private static void LogSuccess(string message) => Debug.Log($"{GREEN}SUCCESS:{NC} {message}");
    private static void LogCommand(string command) => Debug.Log($"{YELLOW}COMMAND:{NC} {command}");
    private static void LogOutput(string output) => Debug.Log($"{BLUE}OUTPUT:{NC} {output}");
}
