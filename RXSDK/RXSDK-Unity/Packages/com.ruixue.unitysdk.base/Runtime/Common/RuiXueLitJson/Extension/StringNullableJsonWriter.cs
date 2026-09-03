using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RuiXueLitJson
{

    public class StringNullableJsonWriter : JsonWriter
    {

        public string lastPropertyName;

        public override void Write(bool boolean)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(boolean);
        }

        public override void Write(decimal number)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(number);
        }

        public override void Write(double number)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(number);
        }

        public override void Write(float number)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(number);
        }

        public override void Write(int number)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(number);
        }

        public override void Write(long number)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(number);
        }


        public override void Write(ulong number)
        {
            base.WritePropertyName(lastPropertyName);
            base.Write(number);
        }

        //public override void WriteArrayEnd()
        //{
        //    base.WriteArrayEnd();
        //}

        //public override void WriteArrayStart()
        //{
        //    base.WritePropertyName(lastPropertyName);
        //    base.WriteArrayStart();
        //}

        //public override void WriteObjectEnd()
        //{
        //    base.WriteObjectEnd();
        //}

        //public override void WriteObjectStart()
        //{
        //    base.WritePropertyName(lastPropertyName);
        //    base.WriteObjectStart();
        //}

        public override void Write(string str)
        {
            if (str == null) return;
            base.WritePropertyName(lastPropertyName);
            base.Write(str);
        }

        public override void WritePropertyName(string property_name)
        {
            lastPropertyName = property_name;
        }

    }

}

