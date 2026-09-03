using System;
using System.Collections.Generic;

public static class RLE
{
    public const byte ESCAPE = 92; // ''
    public const byte MAX_DUPLICATE_COUNT = byte.MaxValue;

    public static byte[] Compress(byte[] input)
    {
        if (input != null)
        {
            m_innerBuffer.Clear();

            var inputIndex = 0;
            while (inputIndex < input.Length)
            {
                if (input[inputIndex] == ESCAPE)
                {
                    // special handle escape
                    m_innerBuffer.Add(ESCAPE);
                    m_innerBuffer.Add(ESCAPE);
                    ++inputIndex;
                }
                else
                {
                    // try find duplicate
                    int duplicateCount = 0;

                    for (int i = inputIndex + 1; i < input.Length; ++i)
                    {
                        if (input[i] == input[inputIndex])
                        {
                            ++duplicateCount;
                            // check max duplicate count
                            if (duplicateCount == MAX_DUPLICATE_COUNT)
                            {
                                break;
                            }
                        }
                        else
                        {
                            break;
                        }
                    }

                    // do not compress less then 3 duplicate since meta data will take 3 byte
                    if (duplicateCount > 2)
                    {
                        m_innerBuffer.Add(ESCAPE);
                        // NOTE we should make value before count, since count could be 'ESCAPE'
                        m_innerBuffer.Add(input[inputIndex]);
                        // NOTE we do -3 offset for extend range mapping
                        m_innerBuffer.Add((byte)(duplicateCount - 3));
                        inputIndex += duplicateCount + 1;
                    }
                    else
                    {
                        m_innerBuffer.Add(input[inputIndex]);
                        ++inputIndex;
                    }
                }
            }

            return m_innerBuffer.ToArray();
        }

        return null;
    }

    public static byte[] Decompress(byte[] input)
    {
        if (input != null)
        {
            m_innerBuffer.Clear();

            var inputIndex = 0;
            while (inputIndex < input.Length)
            {
                if (input[inputIndex] == ESCAPE)
                {
                    if (inputIndex + 1 >= input.Length)
                    {
                        throw new Exception("[RLE]Unexpected Escape(0xFF) detected ...");
                    }
                    else
                    {
                        if (input[inputIndex + 1] == ESCAPE)
                        {
                            m_innerBuffer.Add(ESCAPE);
                            inputIndex += 2;
                        }
                        else
                        {
                            if (inputIndex + 2 >= input.Length)
                            {
                                throw new Exception("[RLE]Error compress data format ...");
                            }
                            else
                            {
                                var value = input[inputIndex + 1];
                                // NOTE we do +3 offset since we compress do -3 offset
                                var duplicateCount = input[inputIndex + 2] + 3;
                                for (int i = 0; i <= duplicateCount; ++i)
                                {
                                    m_innerBuffer.Add(value);
                                }
                                inputIndex += 3;
                            }
                        }
                    }
                }
                else
                {
                    m_innerBuffer.Add(input[inputIndex]);
                    ++inputIndex;
                }
            }

            return m_innerBuffer.ToArray();
        }

        return null;
    }

    static List<byte> m_innerBuffer = new List<byte>(1024);
}